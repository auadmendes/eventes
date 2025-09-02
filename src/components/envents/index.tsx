'use client';
import { useEffect, useState } from "react";
import { deleteEvent, getEvents, updateEvent } from "@/actions/events";
import EventCard from "./EventCard";
import EditEventPopup from "../EditEventPopup";
import { Event } from "@/types/event";
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

  // ✅ Fetch all events initially
  async function fetchEvents(replace = true) {
    try {
      setIsLoading(true);
      const fetchedEvents = await getEvents();

      const mappedEvents = fetchedEvents.map((e: any) => ({
        ...e,
        highlighted: e.highlighted === true,
        site: e.font || "Todos",
        distances: e.distances ?? undefined,
        description: e.description ?? undefined,
      }));

      // Filtering
      let filtered = mappedEvents;

      if (filterCategories.length > 0) {
        filtered = filtered.filter((e) =>
          filterCategories.includes(e.category)
        );
      }

      if (filterSites.length > 0) {
        filtered = filtered.filter((e) => filterSites.includes(e.font));
      }

      if (searchQuery.trim() !== "") {
        const lower = searchQuery.toLowerCase();
        filtered = filtered.filter((e) => {
          const titleMatch = e.title.toLowerCase().includes(lower);
          const locationMatch =
            e.location?.toLowerCase().includes(lower) ?? false;

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
        filtered = filtered.filter((e) => {
          const eventTime = new Date(e.date).getTime();
          return eventTime >= startTime;
        });
      }

      // Sort highlighted first, then by date
      filtered = filtered.sort((a, b) => {
        if (a.highlighted && !b.highlighted) return -1;
        if (!a.highlighted && b.highlighted) return 1;

        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });

      setEvents(filtered);
      onCountChange?.(filtered.length);
      if (replace) setPage(1); // reset pagination if refreshing
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Initial + refetch when filters change
  useEffect(() => {
    fetchEvents(true);
  }, [filterCategories, filterSites, searchQuery, filterStartDate]);

  // ✅ Auto refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents(true);
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
          }, 8800); // simulate async fetch delay
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
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (visibleEvents.length === 0) {
    return <p className="text-center text-gray-500">No events found.</p>;
  }

  return (
    <div>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {visibleEvents.map((event) => (
          <EventCard key={event.id} event={event} onEdit={handleEdit} onDeleted={() => handleDelete(event.id)} />
        ))}
      </main>

      {/* Spinner at the bottom */}
      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      )}
    </div>
  );
}
