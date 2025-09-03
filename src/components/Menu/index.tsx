"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Home, Bell, Bookmark, PlusSquare, MapPinHouse, MapPlus } from "lucide-react";
import Link from "next/link";
import { allowedemailList } from "@/utils/emailList";

export function Menu() {
  const pathname = usePathname();
  const { user } = useUser();

  const isAllowed = user?.emailAddresses?.some((emailObj) =>
      allowedemailList.includes(emailObj.emailAddress)
    );

  const linkClasses = (href: string) =>
    `flex items-center gap-1 lg:items-start lg:w-full rounded-lg lg:p-1 
     hover:bg-light-accent dark:hover:bg-dark-accent transition cursor-pointer
     ${pathname === href ? "text-light-secondary dark:text-dark-secondary" : ""}`;

  const iconClasses = (href: string) =>
    `size-5 stroke-[1.5] ${
      pathname === href
        ? "text-light-secondary dark:text-dark-secondary"
        : "text-light-primary dark:text-dark-primary"
    }`;

  return (
    <header className="w-full flex flex-col bg-light-background 
        dark:bg-dark-background rounded-2xl shadow-md p-3 lg:p-1 transition hover:shadow-lg">
      <nav className="flex flex-row justify-center gap-4 lg:flex-col lg:items-start">
        {/* Home */}
        <Link href="/" className={linkClasses("/")}>
          <Home className={iconClasses("/")} />
          <span className="hidden lg:block font-medium">Home</span>
        </Link>

        <Link href="/PlacesHome" className={linkClasses("/PlacesHome")}>
          <MapPinHouse className={iconClasses("/PlacesHome")} />
          <span className="hidden lg:block font-medium">Onde Ir</span>
        </Link>

        {/* Notifications */}
        {/* href="/notifications" */}
        <Link href="/" className={linkClasses("/notifications")}>
          <Bell className={iconClasses("/notifications")} />
          <span className="hidden lg:block font-medium">Notificacões</span>
        </Link>

        {/* Saves */}
        <Link href="/saved" className={linkClasses("/saved")}>
          <Bookmark className={iconClasses("/saved")} />
          <span className="hidden lg:block font-medium">Savos</span>
        </Link>

        {/* Create */}
        {/* href="/create" */}
        
        {isAllowed && (
          <>
            <Link href="/create" className={linkClasses("/create")}>
              <PlusSquare className={iconClasses("/create")} />
              <span className="hidden lg:block font-medium">Criar</span>
            </Link>
            <Link href="/createplaces" className={linkClasses("/createplaces")}>
              <MapPlus className={iconClasses("/createplaces")} />
              <span className="hidden lg:block font-medium">Criar Lugar</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
