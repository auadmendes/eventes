// types/user.ts

export interface UserType {
  id: string;
  clerkId: string;   // match Prisma field
  email: string;
  name?: string;
  image?: string;
  city?: string;
  bio?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For creating a profile
export interface CreateProfileInput {
  clerkId: string;
  email: string; // required
  name?: string;
  image?: string;
  city?: string;
  bio?: string;
}

// For updating a profile
export interface UpdateProfileInput {
  clerkId: string;
  name?: string;
  image?: string;
  city?: string;
  bio?: string;
}
