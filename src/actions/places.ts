"use server";

import { prisma } from "@/lib/prisma";
import { Place } from "@/types/place";

export interface NewPlace {
  place_name: string;
  short_description: string;
  description?: string;
  city: string;
  neighborhood?: string;
  address?: string;
  location?: string;
  image?: string;
  gallery_images?: string[];
  link?: string;
  category?: string;
  phone_number?: string;
  email?: string;
  opening_hours?: string;
  price_range?: string;
  ticket_required?: boolean;
  ticket_link?: string;
  wheelchair_accessible?: boolean;
  parking?: string;
  pet_friendly?: boolean;
  rating?: number;
  tags?: string[];
  best_time_to_visit?: string;
  published?: boolean;
}

export async function createPlace(data: NewPlace) {
  return await prisma.place.create({
    data: {
      ...data,
      date_created: new Date(),
    },
  });
}

export async function getPlaces(): Promise<Place[]> {
  const places = await prisma.place.findMany({
    where: { published: true }, // only published places
    orderBy: { date_created: "desc" },
  });

  return places.map((p) => ({
    id: p.id,
    place_name: p.place_name,
    short_description: p.short_description ?? undefined,
    description: p.description ?? undefined,
    city: p.city,
    neighborhood: p.neighborhood ?? undefined,
    address: p.address ?? undefined,
    location: p.location ?? undefined,
    image: p.image ?? undefined,
    gallery_images: p.gallery_images ?? undefined,
    link: p.link ?? undefined,
    category: p.category ?? undefined,
    ticket_required: p.ticket_required ?? undefined,
    wheelchair_accessible: p.wheelchair_accessible ?? undefined,
    pet_friendly: p.pet_friendly ?? undefined,
    tags: p.tags ?? undefined,
  }));
}

export async function deletePlace(placeId: string): Promise<void> {
  await prisma.place.delete({ where: { id: placeId } });
}

export async function updatePlace(placeId: string, data: Partial<NewPlace>): Promise<Place> {
  const updated = await prisma.place.update({
    where: { id: placeId },
    data,
  });

  return {
    id: updated.id,
    place_name: updated.place_name,
    short_description: updated.short_description ?? undefined,
    description: updated.description ?? undefined,
    city: updated.city,
    neighborhood: updated.neighborhood ?? undefined,
    address: updated.address ?? undefined,
    image: updated.image ?? undefined,
    link: updated.link ?? undefined,
    category: updated.category ?? undefined,
    ticket_required: updated.ticket_required ?? undefined,
    wheelchair_accessible: updated.wheelchair_accessible ?? undefined,
    pet_friendly: updated.pet_friendly ?? undefined,
    tags: updated.tags ?? undefined,
  };
}

export async function getPlaceById(id: string): Promise<Place | null> {
  // ignore invalid ids like "favicon.ico"
  if (!id || id === "favicon.ico") return null;

  const place = await prisma.place.findUnique({
    where: { id },
  });

  if (!place) return null;

  return {
    id: place.id,
    place_name: place.place_name,
    short_description: place.short_description ?? undefined,
    description: place.description ?? undefined,
    city: place.city,
    neighborhood: place.neighborhood ?? undefined,
    address: place.address ?? undefined,
    location: place.location ?? undefined,
    image: place.image ?? undefined,
    gallery_images: place.gallery_images ?? undefined,
    link: place.link ?? undefined,
    category: place.category ?? undefined,
    phone_number: place.phone_number ?? undefined,
    email: place.email ?? undefined,
    opening_hours: place.opening_hours ?? undefined,
    price_range: place.price_range ?? undefined,
    ticket_required: place.ticket_required ?? undefined,
    ticket_link: place.ticket_link ?? undefined,
    wheelchair_accessible: place.wheelchair_accessible ?? undefined,
    parking: place.parking ?? undefined,
    pet_friendly: place.pet_friendly ?? undefined,
    rating: place.rating ?? undefined,
    tags: place.tags ?? undefined,
    best_time_to_visit: place.best_time_to_visit ?? undefined,
    published: place.published ?? false,
  };
}