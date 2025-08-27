"use server";

import { prisma } from "@/lib/prisma";

export async function getEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      date: { gte: today.toISOString() },
    },
    include: {
      likes: true, // brings all likes linked to each event
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

import { Event } from "@/components/envents/EventCard";

export async function updateEvent(updatedEvent: Event) {
  // Make sure the event exists
  const existing = await prisma.event.findUnique({
    where: { id: updatedEvent.id },
  });

  if (!existing) {
    throw new Error("Event not found");
  }

  // Update only the fields you want
  const savedEvent = await prisma.event.update({
    where: { id: updatedEvent.id },
    data: {
      title: updatedEvent.title,
      date: new Date(updatedEvent.date).toISOString(),
      end_date: updatedEvent.end_date ? new Date(updatedEvent.end_date).toISOString() : null,
      location: updatedEvent.location,
      distances: updatedEvent.distances,
      category: updatedEvent.category,
      font: updatedEvent.font,
      image: updatedEvent.image,
      highlighted: updatedEvent.highlighted,
    },
  });

  return savedEvent;
}