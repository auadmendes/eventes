"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

import { ptBR } from "date-fns/locale";
import { Edit, Star, Bookmark } from "lucide-react";
import LikeButton from "../LikeButton";
import HighlightButton from "../Highlight";
import ShareButton from "../ShareButton";
import { useState, useEffect } from "react";

import { allowedemailList} from '../../utils/emailList';
import { Event } from "@/types/event";

import { formatInTimeZone } from "date-fns-tz";
import DeleteButton from "../DeleteButton";
import { deleteEvent } from "@/actions/events";

import Link from "next/link";

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDeleted?: () => void;
}

export default function EventCardDetails({ event, onEdit }: EventCardProps) {
  const { id, title, date, location, image, link, highlighted, category, font, end_date } = event;
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  // const [events, setEvents] = useState<Event[]>([]);

  // function removeEventFromList(id: string) {
  //   setEvents((prev) => prev.filter((e) => e.id !== id));
  // }


  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("savedEvents") || "[]");
    setSaved(savedEvents.some((e: Event) => e.id === id));
  }, [id]);

  const toggleSave = () => {
    const savedEvents = JSON.parse(localStorage.getItem("savedEvents") || "[]");
    let updated;

    if (saved) {
      updated = savedEvents.filter((e: Event) => e.id !== id);
    } else {
      updated = [...savedEvents, event];
    }

    localStorage.setItem("savedEvents", JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <div
      className={`rounded-2xl shadow-md bg-background-paper
        overflow-visible hover:shadow-lg transition flex flex-col
        ${highlighted ? "border-2 border-light-secondary" : "border border-transparent"}`}
    >
    <div className="relative w-full h-96 lg:h-[700px] rounded-tl-2xl rounded-tr-2xl overflow-hidden">
      <Link href={`/event/${id}`}>
        <Image
          src={
            image && image.trim() !== ""
              ? image
              : "https://media.gettyimages.com/id/175746178/pt/foto/vit%C3%B3ria.jpg?s=1024x1024&w=gi&k=20&c=lhe0kvpAwgUVsyqYwR9tlnkrYlzlWX2K3o2jRLG4b1c="
          }
          alt={title}
          fill
          className="object-fill cursor-pointer"
        />
      </Link>
    </div>

      <div className="flex-1 p-4">
        <p className="text-xs text-text-muted mb-1">
          {formatInTimeZone(date, "UTC", "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
        {end_date && (
          <p className="text-xs text-text-muted mb-1">
            até {formatInTimeZone(end_date, "UTC", "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        )}

        <h3 className="text-lg font-semibold text-text-dark">{title}</h3>

        {location && <p className="text-sm text-text-dark">{location}</p>}

        {event.distances && (
          <p className="text-sm text-light-secondary mt-1">
            Distâncias: {event.distances}
          </p>
        )}

        {event.extra &&  (
          <ul className="mt-1 list-disc list-inside text-sm text-text-muted">
            {event.extra.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        {event.description && event.description.length > 0 && (
          <div className="w-full mt-4">
            <p className="text-sm text-text-dark whitespace-pre-line">
              {expanded
                ? event.description
                : event.description.slice(0, 150) + (event.description.length > 150 ? "..." : "")}
            </p>

            {event.description.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-dark-primary mt-2 hover:underline"
              >
                {expanded ? "Leia menos" : "Leia mais"}
              </button>
            )}
          </div>
        )}

        <span className="inline-block mt-2 px-3 py-1 bg-light-secondary text-white text-xs rounded-full">
          {category}
        </span>
        
        <span className="ml-1 inline-block mt-2 underline text-blue-600 text-xs rounded-full">
          <a target="_blank" href={link}>Site do evento</a>
        </span>
        
        <span className="flex items-center gap-1 text-xs text-primary font-light mt-4">
          {font}
        </span>

        {highlighted && (
          <span className="flex items-center gap-1 text-xs text-primary font-thin mt-4">
            Patrocinado <Star size={12} className="text-yellow-500" fill="currentColor" />
          </span>
        )}
        
      </div>

      <div className="flex justify-between items-center border-t px-4 py-2">
        <ShareButton title={title} url={link} id={id} />

        {user?.emailAddresses?.some(
          (emailObj) => allowedemailList.includes(emailObj.emailAddress)
        ) && (
          <button
            onClick={() => onEdit?.(event)}
            className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition"
          >
            <Edit size={18} />
            <span className="text-xs">Edit</span>
          </button>
        )}

        <LikeButton
          eventId={id}
          userId={String(user?.id)}
          liked={event.likes?.some((like) => like.user_id === user?.id) ?? false}
          count={event.likes?.length ?? 0}
        />

        <button
          onClick={toggleSave}
          className={`flex items-center gap-1 transition ${
            saved ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
          }`}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          <span className="text-xs">{saved ? "Saved" : "Save"}</span>
        </button>

        {user?.emailAddresses?.some(
          (emailObj) => allowedemailList.includes(emailObj.emailAddress)
        )  && <HighlightButton eventId={id} highlighted={event.highlighted ?? false} />}

        
      </div>
      {/* <div className="flex justify-center items-center bg-white hover:bg-red-400 rounded-bl-xl 
      rounded-br-xl text-slate-500 hover:text-white transition-all transform">
        {user?.emailAddresses?.some(emailObj => allowedemailList.includes(emailObj.emailAddress)) && (
          <DeleteButton
            id={event.id}
            
            deleteAction={deleteEvent}
            label="event"
          />
        )}
      </div> */}
    </div>
  );
}
