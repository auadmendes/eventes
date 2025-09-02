'use client';


import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";

import { useEffect, useState } from "react";
import { categories, cities, neighborhoods } from "@/utils/place_categories";
import { ArrowUp } from "lucide-react";
import Select from "react-select";
import PlacesPage from "@/components/Places/PlacesPage";
import ClientOnly from "../clientOnly";

export default function PlacesHome() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [placesCount, setPlacesCount] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 p-6">
          <Menu />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 mb-16 md:mb-0 w-full">
          <div className="w-flex full">
            <h1 className="text-xl font-bold mb-4">Onde Ir</h1>
          </div>
          {/* Category */}
          <div className="sticky top-0 z-50 bg-white shadow-sm rounded-sm px-2 p-2">
            <span className="text-xs text-light-primary">Categoria</span>
            <Select
              isMulti
              isSearchable={false}
              options={categories.map(c => ({ value: c, label: c }))}
              value={categories
                .filter(c => selectedCategories.includes(c))
                .map(c => ({ value: c, label: c }))}
              onChange={selected => setSelectedCategories(selected.map(s => s.value))}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2 mb-4 px-2 p-2">

            {/* City */}
            <div>
              <span className="text-xs text-light-primary">Cidade</span>
              <Select
                isMulti
                isSearchable={false}
                options={cities.map(c => ({ value: c, label: c }))}
                value={cities
                  .filter(c => selectedCities.includes(c))
                  .map(c => ({ value: c, label: c }))}
                onChange={selected => setSelectedCities(selected.map(s => s.value))}
              />
            </div>

            {/* Neighborhood */}
            <div>
              <span className="text-xs text-light-primary">Bairro</span>
              <Select
                isMulti
                isSearchable={false}
                options={neighborhoods.map(n => ({ value: n, label: n }))}
                value={neighborhoods
                  .filter(n => selectedNeighborhoods.includes(n))
                  .map(n => ({ value: n, label: n }))}
                onChange={selected => setSelectedNeighborhoods(selected.map(s => s.value))}
              />
            </div>

            {/* Search */}
            <div>
              <span className="text-xs text-light-primary">Buscar Local</span>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar locais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Count */}
          <div className="text-gray-600 text-sm font-thin mb-4">
            {placesCount ? `${placesCount} locais encontrados` : "Nenhum local encontrado"}
          </div>

          {/* Places list */}
          <ClientOnly>
            <PlacesPage
              filterCategories={selectedCategories}
              filterCities={selectedCities}
              filterNeighborhoods={selectedNeighborhoods}
              searchQuery={searchQuery}
              onCountChange={setPlacesCount}
            />
          </ClientOnly>
        </main>
      </div>

      {/* Mobile menu */}
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
