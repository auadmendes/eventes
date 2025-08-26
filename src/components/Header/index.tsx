"use client";

import { useUser } from "@clerk/nextjs";
import Logo from "../../assets/eventsLogo.png"; 
import { LoggedUser } from "../User";
import Image from "next/image";
export function Header() {
  const { user } = useUser();

  return (
    <header className="w-full flex items-center justify-between bg-light-background 
        dark:bg-dark-background px-6 py-4 shadow-md rounded-b-2xl">
      
      {/* Logo */}
      <div className="flex items-center">
        <Image src={Logo.src} width={100} height={100} alt="Logo" className="h-10 w-auto" /> 
        <div className="flex items-center justify-center ml-3">
          <span className="text-light-primary">Event</span>
          <span className="text-light-secondary">ES</span>
        </div>
      </div>

      {/* User Login / Avatar */}
      <div className="flex items-center justify-center gap-2">
        Oi, {user?.firstName} <LoggedUser />
      </div>
    </header>
  );
}
