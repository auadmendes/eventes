// "use client";

// import { useUser } from "@clerk/nextjs";
// import Logo from "../../../public/logo.png"; 
// import { LoggedUser } from "../User";
// import Image from "next/image";
// export function Header() {
//   const { user } = useUser();

//   return (
//     <header className="w-full flex items-center justify-between bg-light-background 
//         dark:bg-dark-background px-6 py-4 shadow-md rounded-b-2xl">
      
//       {/* Logo */}
//       <div className="flex items-center">
//         <Image src={Logo.src} width={100} height={100} alt="Logo" className="h-10 w-auto" /> 
//         <div className="flex items-center justify-center ml-3">
//           <span className="text-light-primary">Event</span>
//           <span className="text-light-secondary">ES</span>
//         </div>
//       </div>

//       {/* User Login / Avatar */}
//       <div className="flex items-center justify-center gap-2">
//         Oi, {user?.firstName} <LoggedUser />
//       </div>
//     </header>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";

import { Home, HandPlatter, User2, Bookmark, PlusSquare, MapPinHouse, MapPlus, Shield, Menu as MenuIcon, X } from "lucide-react";
import { GrUserWorker } from "react-icons/gr";
import { checkUserRole } from "@/actions/users";
import { LoggedUser } from "../User";

export function Header() {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    if (!user) return;
    (async () => {
      const result = await checkUserRole();
      setHasProfile(result.hasProfile);
      setIsAdmin(result.isAdmin);
    })();
  }, [user]);

  const links = [
    { href: "/", label: "Home", icon: <Home /> },
    { href: "/PlacesHome", label: "Onde Ir", icon: <MapPinHouse /> },
    { href: "/services", label: "Serviços", icon: <GrUserWorker size={24} /> },
    // { href: "/notifications", label: "Notificações", icon: <Bell /> },
    { href: "/saved", label: "Salvos", icon: <Bookmark /> },
    { href: "/Profile", label: "Perfil", icon: <User2 /> },
    { href: "/create-service", label: "Criar meu anúncio", icon: <HandPlatter /> },
  ];

  const profileLinks = hasProfile
    ? [
        
        { href: "/createplaces", label: "Criar Lugar", icon: <MapPlus /> },
      ]
    : [];

  const adminLinks = isAdmin ? [
    { href: "/admin", label: "Admin Panel", icon: <Shield /> },
    { href: "/create", label: "Criar Evento", icon: <PlusSquare /> },
  ] : [];

  const allLinks = [...links, ...profileLinks, ...adminLinks];

  const linkClasses = (href: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition ${
      pathname === href ? "bg-light-accent dark:bg-dark-accent" : ""
    }`;

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between 
    bg-light-background dark:bg-dark-background px-6 py-4 shadow-md rounded-b-2xl 
    z-[9999]">
      {/* Logo */}
      <Link href={'/'} className="flex items-center gap-2">
        <Image src={Logo.src} width={40} height={40} alt="Logo" />
        <span className="font-bold text-lg">EventES</span>
      </Link>

      {/* Mobile Menu Button */}
      <div className="flex">
        <div className="flex justify-center items-center">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
          <div className="lg:hidden">
            <LoggedUser />
          </div>
        </div>
        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-4">
          {allLinks.map((link) => (
            <Link key={link.href} href={link.href} title={link.label} className={linkClasses(link.href)}>
              {link.icon}
              {/* Text hidden below lg */}
              <span className="lg:hidden md:inline font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block mt-1.5 ml-2">
          <LoggedUser />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="absolute top-full right-0 mt-0.5 w-56 bg-light-background dark:bg-dark-background shadow-lg rounded-lg p-3 flex flex-col gap-2 z-[9999] lg:hidden"
        >
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses(link.href)}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      )}

    </header>
  );
}
