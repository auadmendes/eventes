export interface UserType {
    id: string;
    name: string;
    email: string;
    clerkUserId: string;
    createdAt: Date;
    //updatedAt: Date;
    // Add other fields if they exist in your Prisma User model
}