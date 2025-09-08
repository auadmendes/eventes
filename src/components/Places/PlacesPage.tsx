'use client';

import { useEffect, useState, useCallback } from "react";
import { getPlaces, deletePlace, updatePlace } from "@/actions/places";
import { Loader2 } from "lucide-react";
import PlaceCard from "./Placecard";
import { Place } from "@/types/place";
import EditPlacePopup from "../EditPlacePopup";
import { City, Neighborhood } from "@prisma/client";

interface PlacesPageProps {
  filterCategories?: string[];
  filterCities?: string[];         // array of city IDs
  filterNeighborhoods?: string[];  // array of neighborhood IDs
  searchQuery?: string;
  onCountChange?: (count: number) => void;
  cities: City[];
  neighborhoods: Neighborhood[];
}

export default function PlacesPage({
  filterCategories = [],
  filterCities = [],
  filterNeighborhoods = [],
  searchQuery = "",
  onCountChange,
  cities,
  neighborhoods,
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

      // Filter categories
      if (filterCategories.length > 0) {
        filtered = filtered.filter(
          (p) => p.category && filterCategories.includes(p.category)
        );
      }

      // Filter cities by names
      if (filterCities.length > 0) {
        const cityNames = filterCities
          .map(id => cities.find(c => c.id === id)?.name)
          .filter(Boolean) as string[];

        filtered = filtered.filter(
          (p) => p.city && cityNames.includes(p.city)
        );
      }

      // Filter neighborhoods by names
      if (filterNeighborhoods.length > 0) {
        const neighborhoodNames = filterNeighborhoods
          .map(id => neighborhoods.find(n => n.id === id)?.name)
          .filter(Boolean) as string[];

        filtered = filtered.filter(
          (p) => p.neighborhood && neighborhoodNames.includes(p.neighborhood)
        );
      }

      // Filter by search
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
    cities,
    neighborhoods
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
        tags: updatedPlace.tags?.length ? updatedPlace.tags : undefined,
        links: updatedPlace.links?.map(l => ({
          title: l.title || "",
          url: l.url || ""
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
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

return (
  <div className="w-full flex justify-center">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {visiblePlaces.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          onDelete={handleDeletePlace}
          onEdit={() => setEditingPlace(place)}
        />
      ))}

      {loading && (
        <div className="flex justify-center items-center py-4 col-span-full">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      )}

      {editingPlace && (
        <EditPlacePopup
          place={editingPlace}
          isOpen={!!editingPlace}
          onClose={() => setEditingPlace(null)}
          onSave={handleSavePlace}
        />
      )}
    </div>
  </div>
);
}
