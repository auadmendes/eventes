// types/services.ts

import { UserType } from "./user";
import type { User } from "@prisma/client";
// For database Service object
export interface ServiceType {
  id: string;
  userId: string;
  user?: UserType; // optional because you may not always fetch it

  city: string;
  neighborhood: string;
  title: string;
  description: string;
  services: string[]; // array of services offered

  email: string;
  phone?: string;
  showPhone: boolean;

  createdAt: Date;
  updatedAt: Date;

  // Admin validation & ratings
  validated: boolean;
  rating: number; // average rating (e.g., 4.5)
  reviewsCount: number; // number of reviews
  links?: UsefulLink[];
}

// Useful links like Instagram, Facebook, etc.
export interface UsefulLink {
  title: string;
  url: string;
}

// Input for creating a new service

export interface CreateServiceInput {
  userId: string;
  city: string;
  neighborhood: string;
  title: string;
  description: string;
  services: string[];
  email: string;
  phone?: string;
  showPhone?: boolean;
  mainService: string;
  links?: UsefulLink[];
  image?: string; // <-- add this
}


// Input for updating a service
export interface UpdateServiceInput {
  title?: string;
  description?: string;
  services?: string[];

  city?: string;
  neighborhood?: string;

  phone?: string;
  showPhone?: boolean;
  links?: UsefulLink[];

  validated?: boolean;
}

export type Service = {
  id: string;
  userId: string;
  user: User;
  city: string;
  neighborhood: string;
  title: string;
  description: string;
  services: string[];
  phone: string | null;
  showPhone: boolean;
  email: string;
  image: string;
  instagram: string | null; // ✅ allow null
  facebook: string | null;
  website: string | null;
  whatsapp: string | null;
  links: UsefulLink[];
  isValidated: boolean;
  validatedAt?: Date | null;
  validatedBy?: string | null;
  ratingAvg: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
};
