'use client';

import { useEffect, useState, useCallback } from "react";
import { getPlaces, deletePlace, updatePlace } from "@/actions/places"; // updatePlace = your backend update
import { Loader2 } from "lucide-react";
import PlaceCard from "./Placecard";
import { Place } from "@/types/place";
import EditPlacePopup from "../EditPlacePopup";

interface PlacesPageProps {
  filterCategories?: string[];
  filterCities?: string[];
  filterNeighborhoods?: string[];
  searchQuery?: string;
  onCountChange?: (count: number) => void;
}

export default function PlacesPage({
  filterCategories = [],
  filterCities = [],
  filterNeighborhoods = [],
  searchQuery = "",
  onCountChange,
}: PlacesPageProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [editingPlace, setEditingPlace] = useState<Place | null>(null);


  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const visiblePlaces = places.slice(0, page * LIMIT);

  const fetchPlaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedPlaces: Place[] = await getPlaces();

      let filtered = fetchedPlaces;

      if (filterCategories.length > 0) {
        filtered = filtered.filter(
          (p) => p.category && filterCategories.includes(p.category)
        );
      }
      if (filterCities.length > 0) {
        filtered = filtered.filter(
          (p) => p.city && filterCities.includes(p.city)
        );
      }
      if (filterNeighborhoods.length > 0) {
        filtered = filtered.filter(
          (p) =>
            p.neighborhood &&
            filterNeighborhoods.includes(p.neighborhood)
        );
      }

      if (searchQuery.trim() !== "") {
        const lower = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.place_name.toLowerCase().includes(lower) ||
            p.address?.toLowerCase().includes(lower) ||
            p.neighborhood?.toLowerCase().includes(lower) ||
            p.city.toLowerCase().includes(lower)
        );
      }

      setPlaces(filtered);
      onCountChange?.(filtered.length);
      setPage(1);
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    filterCategories,
    filterCities,
    filterNeighborhoods,
    searchQuery,
    onCountChange,
  ]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        if (visiblePlaces.length < places.length && !loading) {
          setLoading(true);
          setTimeout(() => {
            setPage((prev) => prev + 1);
            setLoading(false);
          }, 300);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePlaces.length, places.length, loading]);

  const handleDeletePlace = async (id: string) => {
    try {
      await deletePlace(id);
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

const handleSavePlace = async (updatedPlace: Place) => {
  try {
    const dataToUpdate: Partial<Place> = {
      place_name: updatedPlace.place_name,
      short_description: updatedPlace.short_description || undefined,
      description: updatedPlace.description || undefined,
      city: updatedPlace.city,
      neighborhood: updatedPlace.neighborhood || undefined,
      address: updatedPlace.address || undefined,
      link: updatedPlace.link || undefined,
      image: updatedPlace.image || undefined,
      category: updatedPlace.category || undefined,
      ticket_required: updatedPlace.ticket_required,
      wheelchair_accessible: updatedPlace.wheelchair_accessible,
      pet_friendly: updatedPlace.pet_friendly,
      tags: updatedPlace.tags && updatedPlace.tags.length > 0 ? updatedPlace.tags : undefined,
      links: updatedPlace.links?.map(l => ({
        title: l.title || "", // ensure title is string
        url: l.url || ""      // ensure url is string too
      })),
    };

    const saved = await updatePlace(updatedPlace.id, dataToUpdate);
    setPlaces((prev) =>
      prev.map((p) => (p.id === saved.id ? saved : p))
    );
    setEditingPlace(null);
  } catch (error) {
    console.error("Error saving place:", error);
  }
};



  if (isLoading && places.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (visiblePlaces.length === 0) {
    return (
      <p className="text-center text-gray-500">Nenhum local encontrado.</p>
    );
  }

  return (
    <>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
        {visiblePlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onEdit={() => setEditingPlace(place)}
            onDelete={handleDeletePlace}
          />
        ))}
      </main>

      {loading && (
        <div className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {visiblePlaces.length >= places.length && !isLoading && (
        <p className="text-center text-gray-500 p-6">
          Não há mais locais.
        </p>
      )}

      {/* EDIT POPUP */}
      <EditPlacePopup
        place={editingPlace}
        isOpen={!!editingPlace}
        onClose={() => setEditingPlace(null)}
        onSave={handleSavePlace} // your existing handleSavePlace function
      />


    </>
  );
}
