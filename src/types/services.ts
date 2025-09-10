// types/services.ts

import { UserType } from "./user";
import type { User } from "@prisma/client";
// For database Service object
// For database Service object
export interface ServiceType {
  id: string;
  userId: string;
  user?: UserType;

  city: string;
  neighborhood: string;
  title: string;
  description: string;
  services: string[];
  mainService: string;

  email: string;
  phone?: string;
  showPhone: boolean;

  createdAt: Date;
  updatedAt: Date;

  // Admin validation & ratings
  isValidated: boolean;
  rating: number;
  reviewsCount: number;

  // ✅ Add these
  image?: string;
  images?: string[];
  instagram?: string;
  facebook?: string;
  website?: string;
  whatsapp?: string;

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
   userName: string;
  city: string;
  neighborhood: string;
  title: string;
  description: string;
  services: string[];
  mainService: string;
  email: string;
  phone?: string;
  showPhone?: boolean;
  links?: UsefulLink[];
  image?: string;      // primary image (default user image)
  images?: string[];   // additional images
  instagram?: string;
  facebook?: string;
  website?: string;
  whatsapp?: string;
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

export interface Service {
  id: string;
  userId: string;
  user?: User; // optional include
  userName: string;
  city: string;
  neighborhood: string;
  title: string;
  description: string;
  services: string[];
  mainService: string;

  email: string;
  phone?: string | null;
  showPhone: boolean;

  image?: string;
  images?: string[];
  instagram?: string | null;
  facebook?: string | null;
  website?: string | null;
  whatsapp?: string | null;

  links?: UsefulLink[];

  isValidated?: boolean;
  validatedAt?: Date | null;
  validatedBy?: string | null;

  ratingAvg: number;
  ratingCount: number;

  createdAt: Date;
  updatedAt: Date;
}