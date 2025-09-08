'use client';

import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { useEffect, useState } from "react";
import { categories } from "@/utils/place_categories";
import { ArrowUp } from "lucide-react";
import Select from "react-select";
import PlacesPage from "@/components/Places/PlacesPage";
import ClientOnly from "../clientOnly";
import { City, Neighborhood } from "@prisma/client";
import { getCities, getNeighborhoods } from "@/actions/city";

export default function PlacesHome() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [placesCount, setPlacesCount] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  // Load cities on mount
  useEffect(() => {
    (async () => {
      const citiesData = await getCities();
      setCities(citiesData);
    })();
  }, []);

  // Load neighborhoods when city changes
  useEffect(() => {
    if (!selectedCity) {
      setNeighborhoods([]);
      setSelectedNeighborhood(null);
      return;
    }

    (async () => {
      try {
        const data = await getNeighborhoods(selectedCity);
        setNeighborhoods(data);
        setSelectedNeighborhood(null);
      } catch (err) {
        console.error("Erro ao carregar bairros:", err);
        setNeighborhoods([]);
        setSelectedNeighborhood(null);
      }
    })();
  }, [selectedCity]);

  // Scroll-to-top button
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
        <main className="flex-1 p-6 mb-16 md:mb-0 w-full">
          <div className="w-full mb-4">
            <h1 className="text-xl font-bold">Onde Ir</h1>
          </div>

          {/* Category */}
          <div className="sticky top-0 z-50 bg-white shadow-sm rounded-sm px-1 py-2 mb-4">
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
          <div className="flex flex-col gap-4 mb-4 w-full">
            <div className="flex w-full flex-1 gap-2">
              {/* City */}
              <div className="w-full">
                <span className="text-xs text-light-primary">Cidade</span>
                <Select
                  isClearable
                  placeholder="Cidade"
                  options={cities.map(c => ({ value: c.id, label: c.name }))}
                  value={selectedCity ? { value: selectedCity, label: cities.find(c => c.id === selectedCity)?.name } : null}
                  onChange={(option) => setSelectedCity(option?.value || null)}
                />
              </div>

              {/* Neighborhood */}
              <div className="w-full">
                <span className="text-xs text-light-primary">Bairro</span>
                <Select
                  isClearable
                  placeholder="Bairro"
                  options={neighborhoods.map(n => ({ value: n.id, label: n.name }))}
                  value={selectedNeighborhood ? { value: selectedNeighborhood, label: neighborhoods.find(n => n.id === selectedNeighborhood)?.name } : null}
                  onChange={(option) => setSelectedNeighborhood(option?.value || null)}
                  isDisabled={!selectedCity}
                />
              </div>
            </div>

            {/* Search + Clear Filters */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <span className="text-xs text-light-primary">Buscar Local</span>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Buscar locais..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedCity(null);
                  setSelectedNeighborhood(null);
                  setSearchQuery("");
                }}
                className="px-4 py-2 h-[42px] bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300 transition whitespace-nowrap"
              >
                Remover filtros
              </button>
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
              filterCities={selectedCity ? [selectedCity] : []}
              filterNeighborhoods={selectedNeighborhood ? [selectedNeighborhood] : []}
              searchQuery={searchQuery}
              onCountChange={setPlacesCount}
              cities={cities}
              neighborhoods={neighborhoods}
            />
          </ClientOnly>
        </main>
      </div>

      {/* Mobile menu */}
      {/* <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
        <Menu />
      </nav> */}

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
