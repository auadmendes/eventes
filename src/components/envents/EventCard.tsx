"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Star } from "lucide-react";
import LikeButton from "../LikeButton";
import HighlightButton from "../Highlight";
import ShareButton from "../ShareButton";

export interface Like {
  id: string;
  user_id: string;
  event_id: string;
}

export interface Event {
  id: string;
  link: string;
  title: string;
  date: string;
  end_date: string | null;
  UF: string;
  category: string;
  font: string;
  image: string;
  location: string | null;
  highlighted?: boolean;
  likes?: Like[];
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { id, title, date, location, image, link, highlighted } = event;
  const { user } = useUser();

  return (
    <div
      className={`rounded-2xl shadow-md bg-background-paper 
        overflow-visible hover:shadow-lg transition flex flex-col
        ${highlighted ? "border-2 border-light-secondary" : "border border-transparent"}`}
    >
      {/* Image */}
      <a href={link} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full h-48">
          <Image
            src={
              image && image.trim() !== ""
                ? image
                : "https://media.gettyimages.com/id/175746178/pt/foto/vit%C3%B3ria.jpg?s=1024x1024&w=gi&k=20&c=lhe0kvpAwgUVsyqYwR9tlnkrYlzlWX2K3o2jRLG4b1c="
            }
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </a>

      {/* Content */}
      <div className="flex-1 p-4">
        <p className="text-sm text-text-muted">
          {format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
        <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
        {location && <p className="text-sm text-text-dark">{location}</p>}
        {highlighted && (
          <span className="flex items-center gap-1 text-xs text-primary font-thin mt-4">
            Patrocinado <Star size={12} className="text-yellow-500" fill="currentColor" />
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center border-t px-4 py-2">
        <ShareButton title={title} url={link} />

        <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition">
          <Edit size={18} />
          <span className="text-xs">Edit</span>
        </button>

        <LikeButton
          eventId={id}
          userId={String(user?.id)}
          liked={event.likes?.some((like) => like.user_id === user?.id) ?? false}
          count={event.likes?.length ?? 0}
        />

        {user?.emailAddresses?.some(
          (emailObj) => emailObj.emailAddress === "luciano.auad@gmail.com"
        ) && <HighlightButton eventId={id} highlighted={event.highlighted ?? false} />}
      </div>
    </div>
  );
}
