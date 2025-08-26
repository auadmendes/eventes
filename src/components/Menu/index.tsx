import { Home, Bell, Bookmark, PlusSquare } from "lucide-react";

import Link from "next/link";

export function Menu() {
  return (
    <header className="w-full flex flex-col bg-light-background 
        dark:bg-dark-background rounded-2xl shadow-md p-3 lg:p-1 transition hover:shadow-lg">
      <nav className="flex flex-row justify-center gap-4 lg:flex-col lg:items-start">
        {/* Home */}
        <Link href={'/'} className="flex items-center gap-1 lg:items-start lg:w-full rounded-lg lg:p-1 hover:bg-light-accent dark:hover:bg-dark-accent transition cursor-pointer">
          <Home className="text-light-primary dark:text-dark-primary" size={20} strokeWidth={1.5}/>
          <span className="hidden lg:block text-light-text dark:text-dark-text font-medium">Home</span>
        </Link>

        {/* Notifications */}
        <Link href={'/notifications'} className="flex items-center gap-1 lg:items-start lg:w-full rounded-lg lg:p-1 hover:bg-light-accent dark:hover:bg-dark-accent transition cursor-pointer">
          <Bell className="text-light-primary dark:text-dark-primary" size={20} strokeWidth={1.5}/>
          <span className="hidden lg:block text-light-text dark:text-dark-text font-medium">Notifications</span>
        </Link>

        {/* Saves */}
        <Link href={'/saved'}  className="flex items-center gap-1 lg:items-start lg:w-full rounded-lg lg:p-1 hover:bg-light-accent dark:hover:bg-dark-accent transition cursor-pointer">
          <Bookmark className="text-light-primary dark:text-dark-primary" size={20} strokeWidth={1.5}/>
          <span className="hidden lg:block text-light-text dark:text-dark-text font-medium">Saves</span>
        </Link>

        {/* Create */}
        <Link href={'/create'} className="flex items-center gap-1 lg:items-start lg:w-full rounded-lg lg:p-1 hover:bg-light-accent dark:hover:bg-dark-accent transition cursor-pointer">
          <PlusSquare className="text-light-primary dark:text-dark-primary" size={20} strokeWidth={1.5}/>
          <span className="hidden lg:block text-light-text dark:text-dark-text font-medium">Create</span>
        </Link>
      </nav>
    </header>
  );
}
