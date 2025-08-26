'use client';

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
export function LoggedUser() {
  return (
    <div className="flex items-center justify-center gap-2">
      <SignedIn>
        
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <span className="hidden sm:block text-light-text dark:text-dark-text font-medium">
          Not signed in
        </span>
        <a href="/sign-in" className="text-blue-500">Sign In</a>
      </SignedOut>
    </div>
  );
}
