"use client";

import CreateEvent from "@/components/CreateEvent";
import { Header } from "@/components/Header";
import { allowedemailList } from "@/utils/emailList";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function CreateEventsPage() {
  const { user } = useUser();

  const isAllowed = user?.emailAddresses?.some((emailObj) =>
    allowedemailList.includes(emailObj.emailAddress)
  );

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col w-full">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row justify-center items-center mt-16 px-4 bg-slate-100">
        {/* Main Content */}
        <main className="w-full max-w-[700px] flex flex-col items-center text-center">
          {isAllowed ? (
            <CreateEvent />
          ) : (
            <div className="w-full flex flex-col items-center">
              <span className="inline-block font-medium">
                Você não tem permissão para criar eventos.
              </span>
              <span className="text-sm inline-block mt-1">
                Para maiores informações envie um email para
                <span className="text-slate-500 ml-1">
                  luciano.auad@gmail.com
                </span>.
              </span>

              <div className="h-96 w-full max-w-[900px] mt-6 rounded flex items-center justify-center">
                <Image
                  src="https://images.pexels.com/photos/15154662/pexels-photo-15154662.jpeg"
                  alt="Acesso negado"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover rounded"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
