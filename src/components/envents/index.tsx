'use client';
import { useEffect, useState, useCallback } from "react";
import { deleteEvent, getEvents, updateEvent } from "@/actions/events";
import EventCard from "./EventCard";
import EditEventPopup from "../EditEventPopup";
import { Event, Like } from "@/types/event";
import { Loader2 } from "lucide-react";

interface EventsPageProps {
  filterCategories?: string[];
  filterSites?: string[];
  searchQuery?: string;
  filterStartDate?: string;
  onCountChange?: (count: number) => void;
}

export default function EventsPage({
  filterCategories = [],
  filterSites = [],
  searchQuery = "",
  filterStartDate,
  onCountChange,
}: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const visibleEvents = events.slice(0, page * LIMIT);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedEvents: Event[] = (await getEvents()).map((e) => ({
        ...e,
        highlighted: e.highlighted ?? false,
        site: e.font || "Todos",
        distances: e.distances ?? undefined,
        description: e.description ?? undefined,
      }));

      let filtered = fetchedEvents;

      if (filterCategories.length > 0)
        filtered = filtered.filter((e) => filterCategories.includes(e.category));
      if (filterSites.length > 0)
        filtered = filtered.filter((e) => filterSites.includes(e.font));
      if (searchQuery.trim() !== "") {
        const lower = searchQuery.toLowerCase();
        filtered = filtered.filter((e) => {
          const titleMatch = e.title.toLowerCase().includes(lower);
          const locationMatch = e.location?.toLowerCase().includes(lower) ?? false;
          const dateString = new Date(e.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          const dateMatch = dateString.toLowerCase().includes(lower);
          return titleMatch || locationMatch || dateMatch;
        });
      }
      if (filterStartDate) {
        const startTime = new Date(filterStartDate).getTime();
        filtered = filtered.filter((e) => new Date(e.date).getTime() >= startTime);
      }

      // Sort highlighted first, then by date
      filtered.sort((a, b) => {
        if (a.highlighted && !b.highlighted) return -1;
        if (!a.highlighted && b.highlighted) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setEvents(filtered);
      onCountChange?.(filtered.length);
      setPage(1);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterCategories, filterSites, searchQuery, filterStartDate, onCountChange]);

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ✅ Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        if (visibleEvents.length < events.length && !loading) {
          setLoading(true);
          setTimeout(() => {
            setPage((prev) => prev + 1);
            setLoading(false);
          }, 800);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleEvents.length, events.length, loading]);

  // --- Handlers ---
  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      onCountChange?.(events.length - 1);
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

const handleSave = async (updatedEvent: Event) => {
  try {
    const savedEvent = await updateEvent(updatedEvent);

    // normalize to match Event type
    const normalizedEvent: Event = {
      ...savedEvent,
      highlighted: savedEvent.highlighted ?? false,
      distances: savedEvent.distances ?? undefined,
      description: savedEvent.description ?? undefined,
    };

    setEvents((prev) =>
      prev.map((e) => (e.id === normalizedEvent.id ? normalizedEvent : e))
    );
  } catch (error) {
    console.error("Error updating event:", error);
  }
};


  // --- UI ---
  if (isLoading && events.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (visibleEvents.length === 0) {
    return <p className="text-center text-gray-500">No events found.</p>;
  }

  return (
    <>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {visibleEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={handleEdit}
            onDeleted={() => handleDelete(event.id)}
          />
        ))}
      </main>

      {loading && (
        <div className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {visibleEvents.length >= events.length && !isLoading && (
        <p className="text-center text-gray-500 p-6">No more events.</p>
      )}

      <EditEventPopup
        event={selectedEvent}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
