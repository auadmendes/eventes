'use client';

import EventsPage from "@/components/envents";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import ClientOnly from "./clientOnly";
import { useEffect, useState } from "react";
import { categories } from "@/utils/categories";
import { sites } from "@/utils/places";
import { ArrowUp } from "lucide-react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedSite, setSelectedSite] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // const formattedDate =
  //   selectedDate && format(parseISO(selectedDate), "dd/MM/yyyy", { locale: ptBR });

    registerLocale("pt-BR", ptBR);

  // Show button when scrolled down
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

          <div className="max-w-full md:w-full sticky top-0 z-50 bg-white shadow-sm rounded-full gap-2 p-2 mb-4">
            <select
              className="w-full md:w-auto px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory || "Todos"}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row bg-white shadow-sm rounded-full gap-2 p-2 mb-4">
            <select
              className="w-full md:w-auto px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="w-full md:w-auto px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Selecione a data"
            />
          </div>

          <div className="text-gray-600 text-sm font-thin mb-4">
            {eventsCount ? `${eventsCount} events found` : "No events found"}
          </div>
          <ClientOnly>
            <EventsPage 
              filterCategory={selectedCategory} 
              filterSite={selectedSite} 
              searchQuery={searchQuery} 
              onCountChange={setEventsCount}
              filterStartDate={
                selectedDate 
                  ? format(selectedDate, "yyyy-MM-dd") // use ISO format
                  : undefined
              }
            />
          </ClientOnly>
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
