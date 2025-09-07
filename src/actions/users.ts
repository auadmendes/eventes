"use server"; // <- MUST be at the top of the file

import { prisma } from "@/lib/prisma";
import { CreateProfileInput } from "@/types/user";
import { auth } from "@clerk/nextjs/server";

interface UpdateProfileInput {
  clerkId: string;
  name?: string;
  image?: string;
  city?: string;
  bio?: string;
}

// Get profile
export async function getProfile(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

// Create profile
export async function createProfile(data: CreateProfileInput) {
  return prisma.user.create({
    data: {
      clerkId: data.clerkId,
      email: data.email!,
      name: data.name,
      city: data.city,
      bio: data.bio,
      image: data.image,
      isAdmin: false,
    },
  });
}

// Update profile
export async function updateProfile(data: UpdateProfileInput) {
  return prisma.user.update({
    where: { clerkId: data.clerkId },
    data: {
      name: data.name,
      city: data.city,
      bio: data.bio,
      image: data.image,
      updatedAt: new Date(),
    },
  });
}

// Upsert profile
export async function upsertProfile(data: CreateProfileInput & { bio?: string; city?: string; image?: string; name?: string }) {
  return prisma.user.upsert({
    where: { clerkId: data.clerkId },
    create: {
      clerkId: data.clerkId,
      email: data.email!,
      name: data.name,
      city: data.city,
      bio: data.bio,
      image: data.image,
      isAdmin: false,
    },
    update: {
      name: data.name,
      city: data.city,
      bio: data.bio,
      image: data.image,
      updatedAt: new Date(),
    },
  });
}

// Check if user is admin
export async function isAdmin(userId: string, email?: string) {
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user && email) {
    user = await prisma.user.create({ data: { clerkId: userId, email, isAdmin: false } });
  }
  return user?.isAdmin === true;
}

// List all users
export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      clerkId: true,
      email: true,
      name: true,
      city: true,
      bio: true,
      isAdmin: true,
      createdAt: true,
    },
  });
}

// Toggle admin
export async function toggleAdmin(userId: string, makeAdmin: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { isAdmin: makeAdmin },
  });
}

export async function checkUserRole() {
  const { userId } = await auth();
  if (!userId) return { hasProfile: false, isAdmin: false };

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return { hasProfile: false, isAdmin: false };
  }

  return {
    hasProfile: true,
    isAdmin: user.isAdmin,
  };
}
