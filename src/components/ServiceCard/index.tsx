"use client";

import Image from "next/image";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaFacebook, FaInstagram, FaWhatsapp, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import type { Service } from "@/types/services";
import { useState } from "react";
import EditServicePopup from "../EditServicePopup";


const MAX_LENGTH = 120;

interface ServiceCardProps {
  service: Service;
  onUpdate?: (updatedService: Service) => Promise<void>;
  onDelete?: (serviceId: string) => Promise<void>;
}

export default function ServiceCard({ service, onUpdate, onDelete }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const shortDescription =
    service.description.length > MAX_LENGTH
      ? service.description.slice(0, MAX_LENGTH) + "..."
      : service.description;

  const images =
    service.images && service.images.length > 0
      ? service.images
      : service.image
      ? [service.image]
      : [];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden relative">
        {images.length > 0 ? (
          <Slider {...sliderSettings} className="h-48">
            {images.map((img, idx) => (
              <div key={idx} className="w-full h-48 relative">
                <Image
                  src={img}
                  alt={`${service.title} - ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <div className="p-4 space-y-2 text-sm">
          <h2 className="font-semibold text-lg">{service.title}</h2>

          <p>
            {expanded ? service.description : shortDescription}{" "}
            {service.description.length > MAX_LENGTH && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 ml-1 underline text-sm"
              >
                {expanded ? "Leia menos" : "Leia mais"}
              </button>
            )}
          </p>

          <p className="text-gray-500">{service.city} - {service.neighborhood}</p>

          {service.services.length > 0 && (
            <p><strong>Serviços:</strong> {service.services.join(", ")}</p>
          )}

          {service.showPhone && service.phone && (
            <p><strong>Fone:</strong> {service.phone}</p>
          )}

          <p className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>{service.ratingAvg.toFixed(1)} ({service.ratingCount})</span>
          </p>

          {service.links && service.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              <strong>Links:</strong>
              {service.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}

          {service.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={service.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {service.website}
              </a>
            </p>
          )}

          <div className="flex gap-4 mt-2">
            {service.facebook && (
              <a href={service.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-blue-600 w-6 h-6" />
              </a>
            )}
            {service.instagram && (
              <a href={service.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-pink-500 w-6 h-6" />
              </a>
            )}
            {service.whatsapp && (
            <a
                href={`https://whatsa.me/55${service.whatsapp}/?t=Olá ${service.userName} estou vindo do Site Pocando`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaWhatsapp className="text-green-500 w-6 h-6" />
            </a>
            )}

          </div>

          {(onUpdate || onDelete) && (
            <div className="flex gap-2 mt-4">
              {onUpdate && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FaEdit /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(service.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <FaTrash /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    {isEditing && onUpdate && (
        <EditServicePopup
            service={service}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={async (updatedService: Service) => {
            await onUpdate(updatedService);
            setIsEditing(false);
            }}
            onDelete={onDelete}
        />
    )}

    </>
  );
}
