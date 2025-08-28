'use client';

import EventsPage from "@/components/envents";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import ClientOnly from "./clientOnly";
import { useEffect, useState } from "react";
import { categories } from "@/utils/categories";
import { sites } from "@/utils/places";
import { ArrowUp } from "lucide-react";
import Select from "react-select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
      <Header />

      {/* Main Content + Sidebar */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 p-6">
          <Menu />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 mb-16 md:mb-0 w-full">
          
          {/* Category filter */}
          <div className="flex flex-col max-w-full md:w-full sticky top-0 z-50 bg-white shadow-sm rounded-sm px-2 p-2 mb-4">
            <span className="text-xs text-light-primary">Categoria</span>


          <Select
            isMulti
            options={categories.map((c) => ({ value: c, label: c }))}
            value={categories
              .filter((c) => selectedCategories.includes(c))
              .map((c) => ({ value: c, label: c }))}
            onChange={(selected) =>
              setSelectedCategories(selected.map((s) => s.value))
            }
          />

          </div>

          {/* Site, search, date filters */}
          <div className="flex flex-col md:flex-row  gap-2 p-2 mb-4">

            {/* Criadores + Data */}
            <div className="flex flex-row flex-wrap gap-2 w-full md:w-auto justify-center">
              {/* Criadores */}
              <div className="flex flex-col min-w-[200px] flex-1">
                <span className="text-xs text-light-primary ">Criadores</span>
                <Select
                  isMulti
                  options={sites.map((site) => ({ value: site, label: site }))}
                  value={sites
                    .filter((site) => selectedSites.includes(site))
                    .map((site) => ({ value: site, label: site }))}
                  onChange={(selected) =>
                    setSelectedSites(selected.map((s) => s.value))
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "2.5rem", // ~ h-24
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: "2.5rem",
                    }),
                  }}
                />
              </div>

              {/* Data */}
              <div className="flex flex-col min-w-[100px] flex-1">
                <span className="text-xs text-light-primary">Data</span>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Selecione a data"
                />
              </div>
            </div>

            {/* Search box */}
            <div className="flex flex-col w-full lg:max-w-[500px]">
              <span className="text-xs text-light-primary">
                Evento | Local | Nome
              </span>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

          </div>


          {/* Count */}
          <div className="text-gray-600 text-sm font-thin mb-4">
            {eventsCount ? `${eventsCount} events found` : "No events found"}
          </div>

          {/* Events list */}
          <ClientOnly>
            <EventsPage
              filterCategories={selectedCategories}
              filterSites={selectedSites}
              searchQuery={searchQuery}
              onCountChange={setEventsCount}
              filterStartDate={
                selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
              }
            />
          </ClientOnly>
        </main>
      </div>

      {/* Mobile Menu (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
        <Menu />
      </nav>

      {/* Scroll to top */}
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
