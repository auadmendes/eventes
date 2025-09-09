'use server'; // 🔥 important! Prisma runs on the server only

import { prisma } from "@/lib/prisma";
import type { CreateServiceInput, ServiceType } from "@/types/services";

// /actions/services.ts
import { Service } from "@/types/services";

export async function createService(data: CreateServiceInput) {
  try {
    const service = await prisma.service.create({
      data: {
        userId: data.userId,
        city: data.city,
        neighborhood: data.neighborhood,
        title: data.title,
        description: data.description,
        mainService: data.mainService,     // single string
        services: data.services,           // array
        email: data.email,
        phone: data.phone || null,
        showPhone: data.showPhone ?? false,
        links: data.links || [],
        image: data.image || "",
        images: data.images || [],         // <-- add this
        instagram: data.instagram || "",   // <-- add this
        facebook: data.facebook || "",     // <-- add this
        website: data.website || "",       // <-- add this
        whatsapp: data.whatsapp || "",     // <-- add this
        isValidated: false,
        validatedAt: null,
        validatedBy: null,
      },
    });
    return service;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}



// Fetch all validated services
export async function getServices(): Promise<ServiceType[]> {
  return prisma.service.findMany({
    where: { isValidated: true },
    orderBy: { createdAt: "desc" },
  }) as unknown as ServiceType[];
}

// Fetch services created by a specific user
export async function getUserServices(userId: string): Promise<ServiceType[]> {
  return prisma.service.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  }) as unknown as ServiceType[];
}



// Fetch all services that are not yet validated
export async function getPendingServices(): Promise<Service[]> {
  return prisma.service.findMany({
    where: { isValidated: false },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true, // ✅ include the related user
    },
  });
}

// Validate a specific service
export async function validateService(serviceId: string, adminId: string): Promise<Service> {
  return prisma.service.update({
    where: { id: serviceId },
    data: {
      isValidated: true,
      validatedBy: adminId,
      validatedAt: new Date(),
    },
    include: {
      user: true, // ✅ include the related user
    },
  });
}
