'use client';

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

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
        <Link href="/sign-in" className="text-blue-500">Sign In</Link>
      </SignedOut>
    </div>
  );
}
