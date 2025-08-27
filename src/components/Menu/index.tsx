"use client";

import { Home, Bell, Bookmark, PlusSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu() {
  const pathname = usePathname();

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

        {/* Notifications */}
        <Link href="/notifications" className={linkClasses("/notifications")}>
          <Bell className={iconClasses("/notifications")} />
          <span className="hidden lg:block font-medium">Notifications</span>
        </Link>

        {/* Saves */}
        <Link href="/saved" className={linkClasses("/saved")}>
          <Bookmark className={iconClasses("/saved")} />
          <span className="hidden lg:block font-medium">Saves</span>
        </Link>

        {/* Create */}
        <Link href="/create" className={linkClasses("/create")}>
          <PlusSquare className={iconClasses("/create")} />
          <span className="hidden lg:block font-medium">Create</span>
        </Link>
      </nav>
    </header>
  );
}
