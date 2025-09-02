"use server";

import { Event } from "@/types/event";

import { NewEvent } from "@/types/event";

import { prisma } from "@/lib/prisma";

export async function getEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { date: { gte: today.toISOString() } }, // upcoming events
        { end_date: { gte: today.toISOString() } }, // ongoing events
      ],
    },
    include: {
      likes: true,
    },
    orderBy: { date: "asc" },
  });

  return events;
}


export async function likeEvent(userId: string, eventId: string) {
  // check if already liked
  const existing = await prisma.like.findFirst({
    where: { user_id: userId, event_id: eventId },
  });

  if (existing) {
    // unlike (delete)
    await prisma.like.delete({
      where: { id: existing.id },
    });
    return { liked: false };
  } else {
    // like (create)
    await prisma.like.create({
      data: { user_id: userId, event_id: eventId },
    });
    return { liked: true };
  }
}

export async function toggleHighlight(eventId: string) {
  // Get current event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // Toggle highlighted
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: { highlighted: !event.highlighted },
  });

  return updatedEvent;
}

export async function updateEvent(updatedEvent: Event) {
  const existing = await prisma.event.findUnique({
    where: { id: updatedEvent.id },
  });

  if (!existing) {
    throw new Error("Event not found");
  }

  const savedEvent = await prisma.event.update({
    where: { id: updatedEvent.id },
    data: {
      title: updatedEvent.title,
      link: updatedEvent.link,
      date: updatedEvent.date,
      end_date: updatedEvent.end_date || null,
      location: updatedEvent.location,
      distances: updatedEvent.distances,
      category: updatedEvent.category,
      font: updatedEvent.font,
      image: updatedEvent.image,
      highlighted: updatedEvent.highlighted,
      description: updatedEvent.description ?? null, // <- add this
    },
  });

  return savedEvent;
}


export async function createEvent(eventData: NewEvent) {
  return await prisma.event.create({
    data: {
      title: eventData.title,
      link: eventData.link,
      date: new Date(eventData.date).toISOString(),
      end_date: eventData.end_date ? new Date(eventData.end_date).toISOString() : null,
      UF: eventData.UF,
      category: eventData.category,
      font: eventData.font,
      image: eventData.image,
      location: eventData.location,
      distances: eventData.distances ?? null,
      extra: eventData.extra ?? [],
      description: eventData.description ?? null, // <- add this
    },
  });
}

export async function deleteEvent(eventId: string): Promise<void> {
  const existing = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existing) {
    throw new Error("Event not found");
  }

  // Delete likes first (if you have relations)
  await prisma.like.deleteMany({ where: { event_id: eventId } });

  // Delete the event
  await prisma.event.delete({ where: { id: eventId } });

  // No need to return anything
}
