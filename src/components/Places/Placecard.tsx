'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Edit, Bookmark, Accessibility, Dog, Ticket } from "lucide-react";
import ShareButton from "../ShareButton";
import { allowedemailList } from "@/utils/emailList";
import DeleteButton from "../DeleteButton";
import { Place } from "@/types/place";
import { deletePlace } from "@/actions/places";

interface PlaceCardProps {
  place: Place;
  onEdit?: (place: Place) => void;
  onDelete?: (placeId: string) => void;
}

export default function PlaceCard({ place, onEdit, onDelete }: PlaceCardProps) {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    id,
    place_name,
    category,
    city,
    neighborhood,
    address,
    image,
    link,
    description,
    short_description,
    tags,
    wheelchair_accessible,
    pet_friendly,
    ticket_required,
  } = place;

  // Load saved status from localStorage
  useEffect(() => {
    const savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]");
    setSaved(savedPlaces.some((p: Place) => p.id === id));
  }, [id]);

  const toggleSave = () => {
    const savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]");
    let updated;

    if (saved) {
      updated = savedPlaces.filter((p: Place) => p.id !== id);
    } else {
      updated = [...savedPlaces, place];
    }

    localStorage.setItem("savedPlaces", JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <div className="rounded-2xl shadow-md bg-background-paper hover:shadow-lg transition flex flex-col border border-transparent">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
          <Image
            src={
              image ||
              "https://media.gettyimages.com/id/175746178/pt/foto/vit%C3%B3ria.jpg?s=1024x1024&w=gi&k=20&c=lhe0kvpAwgUVsyqYwR9tlnkrYlzlWX2K3o2jRLG4b1c="
            }
            alt={place_name}
            fill
            className="object-cover"
          />
        </div>
      </a>

      <div className="flex-1 p-4">
        <h3 className="text-lg font-semibold text-text-dark">{place_name}</h3>
        <p className="text-sm text-text-muted">
          {neighborhood ? `${neighborhood}, ` : ""}
          {city}
        </p>
        {address && <p className="text-sm text-text-dark">{address}</p>}

        {/* Short description */}
        {description ? (
          <p className="text-sm text-text-dark mt-1 whitespace-pre-line">
            {expanded
              ? description
              : (short_description || description).slice(0, 150) +
                (description.length > 150 ? "..." : "")}
          </p>
        ) : (
          short_description && (
            <p className="text-sm text-text-dark mt-1">{short_description}</p>
          )
        )}
        {description && description.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-dark-primary mt-1 hover:underline"
          >
            {expanded ? "Ler menos" : "Ler mais"}
          </button>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
          {tags && tags.length > 0 ? (
            tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full">
              Sem tag
            </span>
          )}
        </div>

        {/* Category */}
        {category && (
          <span className="inline-block mt-2 px-3 py-1 bg-light-secondary text-white text-xs rounded-full">
            {category}
          </span>
        )}

        {/* Accessibility */}
        <div className="flex flex-wrap w-full gap-2 mt-2 text-xs text-text-dark">
          {wheelchair_accessible && (
            <span className="flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-300 text-black text-xs rounded-full">
              <Accessibility size={18} /> Acessível
            </span>
          )}
          {pet_friendly && (
            <span className="flex items-center gap-1 mt-2 px-3 py-1 bg-blue-300 text-black text-xs rounded-full">
              <Dog size={18} /> Pet friendly
            </span>
          )}
          {ticket_required && (
            <span className="flex items-center gap-1 mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
              <Ticket size={18} />
              Precisa de Ticket
            </span>
          )}
        </div>
      </div>

      {/* Bottom icons */}
      <div className="flex justify-between items-center border-t px-4 py-2">
        <ShareButton title={place_name} id={id} />

        <button
          onClick={toggleSave}
          className={`flex items-center gap-1 transition ${
            saved ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
          }`}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          <span className="text-xs">{saved ? "Saved" : "Save"}</span>
        </button>

        {user?.emailAddresses?.some((emailObj) =>
          allowedemailList.includes(emailObj.emailAddress)
        ) && (
          <>
            <button
              onClick={() => onEdit?.(place)}
              className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition"
            >
              <Edit size={18} />
              <span className="text-xs">Edit</span>
            </button>

            <DeleteButton
              id={place.id}
              onDelete={onDelete}
              deleteAction={deletePlace}
              label="place"
            />
          </>
        )}
      </div>
    </div>
  );
}
