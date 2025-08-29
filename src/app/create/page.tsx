"use client";

import CreateEvent from "@/components/CreateEvent";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { allowedemailList } from "@/utils/emailList";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";


export default function CreateEventsPage() {
  const { user } = useUser();

  const isAllowed = user?.emailAddresses?.some((emailObj) =>
    allowedemailList.includes(emailObj.emailAddress)
  );

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 p-6">
          <Menu />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 mb-16 md:mb-0 w-full">
          {isAllowed ? (
            <CreateEvent />
          ) : (
            <div className="w-full">
                <span className="inline-block">Você não tem permissão para criar eventos.</span>
                <span className="text-sm inline-block">Para maiores informações envio um emila para 
                    <span className="text-slate-500 ml-1">luciano.auad@gmail.com</span>.
                </span>

                <div className="h-96 w-full mt-4 rounded flex items-center ">
                    <Image 
                        src="https://images.pexels.com/photos/15154662/pexels-photo-15154662.jpeg?_gl=1*y89mcg*_ga*NTEwNTAxNTA5LjE3NTY0ODY2NTU.*_ga_8JE65Q40S6*czE3NTY0ODY2NTQkbzEkZzEkdDE3NTY0ODY4OTIkajIkbDAkaDA."
                        alt="Acesso negado"
                        width={400}
                        height={300}
                        className="h-full w-full max-w-[900px]"
                    />
                </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Menu (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
        <Menu />
      </nav>
    </div>
  );
}
