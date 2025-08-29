"use client";

import CreateEvent from "@/components/CreateEvent";
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


export default function CreateEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);


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
                <h1>Criar evento</h1>
                <CreateEvent />
            </main>
    
          </div>
    
          {/* Mobile Menu (Bottom Bar) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
            <Menu />
          </nav>
          
    </div>
  );
}
