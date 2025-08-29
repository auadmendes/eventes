'use client';
import { useEffect, useState } from "react";
import { getEvents, updateEvent } from "@/actions/events";
import EventCard from "./EventCard";
import EditEventPopup from "../EditEventPopup";
import { Event } from "@/types/event";

interface EventsPageProps {
  filterCategories?: string[];   // instead of filterCategory?: string
  filterSites?: string[];        // instead of filterSite?: string
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEvents();
        
        const mappedEvents = fetchedEvents.map((e) => ({
          ...e,
          highlighted: e.highlighted === true,
          site: e.font || "Todos",
          distances: e.distances === null ? undefined : e.distances,
        }));

        let filtered = mappedEvents;

        // filter by category
        if (filterCategories.length > 0) {
          filtered = filtered.filter((e) => filterCategories.includes(e.category));
        }

        // filter by site
        if (filterSites.length > 0) {
          filtered = filtered.filter((e) => filterSites.includes(e.font));
        }

        // filter by search
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

        // ✅ filter by date range
        if (filterStartDate) {
          //console.log("Filtering from date:", filterStartDate);
          const startTime = new Date(filterStartDate).getTime();
          filtered = filtered.filter((e) => {
            const eventTime = new Date(e.date).getTime();
            return eventTime >= startTime; // only events on or after the selected date
          });
        }


        // ✅ sort highlighted first, then by date (earliest first)
        filtered = filtered.sort((a, b) => {
          if (a.highlighted && !b.highlighted) return -1;
          if (!a.highlighted && b.highlighted) return 1;

          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });

        setEvents(filtered);
        console.log(filtered, '-------------------------------------------------------------')
        onCountChange?.(filtered.length);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [filterCategories, filterSites, searchQuery, filterStartDate, onCountChange]);

  const handleEdit = (event: Event) => {
      setSelectedEvent(event);
      setIsPopupOpen(true);
    };

  const handleSave = async (updatedEvent: Event) => {
    try {
      const savedEvent = await updateEvent(updatedEvent);

      // Normalize nullable fields
      const normalizedEvent: Event = {
        ...savedEvent,
        highlighted: savedEvent.highlighted ?? false, // convert null -> false
        distances: savedEvent.distances ?? undefined, // optional
        //location: savedEvent.location ?? undefined,   // optional
      };

      setEvents((prev) =>
        prev.map((e) => (e.id === normalizedEvent.id ? normalizedEvent : e))
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500">No events found.</p>;
  }

  return (
    <>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={handleEdit} // <-- pass the edit handler
          />
        ))}
      </main>
      <EditEventPopup
        event={selectedEvent}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSave}
        
      />
    </>
  );
}
