"use client";

import EventCard from "@/components/envents/EventCard";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

// Define the Event type to match the expected properties
type Event = {
  id: string;
  link: string;
  title: string;
  date: string;
  end_date: string;
  location: string;
  UF: string;
  description: string;
  image: string;
  organizer: string;
  category: string;
  price: string;
  font: string;
};


export default function SavedEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("savedEvents") || "[]");
    setEvents(savedEvents);
  }, []);

    useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
        <Header/>
          {/* Main Content + Sidebar */}
          <div className="flex flex-1 flex-col md:flex-row">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:block w-64 p-6">
              <Menu />
            </aside>
    
            {/* Main Content */}
            <main className="flex-1 p-6 mb-16 md:mb-0 w-full">
                <span>Nenhum Evento Salvo</span>
            </main>
    
          </div>
        {/* Mobile Menu (Bottom Bar) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
            <Menu />
          </nav>
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
              aria-label="Scroll to top"
            >
              <ArrowUp size={24} />
            </button>
          )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
          {/* Top Header */}
          <Header/>
    
          {/* Main Content + Sidebar */}
          <div className="flex flex-1 flex-col md:flex-row">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:block w-64 p-6">
              <Menu />
            </aside>
    
            {/* Main Content */}
            <main className="flex-1 p-6 mb-16 md:mb-0 w-full">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event?.id} event={event} />
                    ))}
                </div>
            </main>
    
          </div>
    
          {/* Mobile Menu (Bottom Bar) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
            <Menu />
          </nav>
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
              aria-label="Scroll to top"
            >
              <ArrowUp size={24} />
            </button>
          )}
    </div>
  );
}
