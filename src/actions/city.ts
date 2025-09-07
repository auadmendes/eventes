'use server'; // 🔥 important! Prisma runs on the server only

import { prisma } from "@/lib/prisma";

// Create a city
export async function createCity(name: string) {
  return prisma.city.create({ data: { name } });
}

// Get all cities
export async function getCities() {
  return prisma.city.findMany({
    orderBy: { name: "asc" },
    include: { neighborhoods: true },
  });
}

// Update city
export async function updateCity(cityId: string, name: string) {
  return prisma.city.update({ where: { id: cityId }, data: { name } });
}

// Delete city
export async function deleteCity(cityId: string) {
  await prisma.neighborhood.deleteMany({ where: { cityId } });
  return prisma.city.delete({ where: { id: cityId } });
}

// Neighborhood CRUD
export async function createNeighborhood(cityId: string, name: string) {
  return prisma.neighborhood.create({ data: { name, cityId } });
}

export async function getNeighborhoods(cityId?: string) {
  return prisma.neighborhood.findMany({
    where: cityId ? { cityId } : {},
    include: { city: true },
    orderBy: { name: "asc" },
  });
}

export async function updateNeighborhood(neighborhoodId: string, name: string, cityId?: string) {
  return prisma.neighborhood.update({ where: { id: neighborhoodId }, data: { name, cityId } });
}

export async function deleteNeighborhood(neighborhoodId: string) {
  return prisma.neighborhood.delete({ where: { id: neighborhoodId } });
}
