// import { getEventById } from "@/actions/events"; 
// import { Event } from "@/types/event";
// import { Menu } from "@/components/Menu";
// import { Header } from "@/components/Header";
// import EventCardDetails from "@/components/envents/EventCardDetails";

// interface EventPageProps {
//   params: Promise<{ id: string }>; // 👈 params is now async
// }


// export default async function EventPage({ params }: EventPageProps) {
//   const { id } = await params; // 👈 must await before using
//   const event: Event | null = await getEventById(id);

//   if (!event) return <p>Event not found.</p>;

//   return (
//     <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
//       <Header />
//       <div className="flex flex-1 flex-col md:flex-row">
//         <aside className="hidden md:block w-64 p-6">
//           <Menu />
//         </aside>

//         <main className="p-6 mb-16 md:mb-0 w-full md:max-w-[800px]">
//           <EventCardDetails event={event} />
//         </main>
//       </div>

//       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
//         <Menu />
//       </nav>
//     </div>
//   );
// }











import { getEventById } from "@/actions/events"; 
import { Event } from "@/types/event";
import { Menu } from "@/components/Menu";
import { Header } from "@/components/Header";
import { Metadata } from "next";
import EventCardDetails from "@/components/envents/EventCardDetails";

export const dynamic = "force-dynamic"; // ✅ force SSR

interface EventPageProps {
  params: Promise<{ id: string }>; // ✅ Promise
}



// ✅ Generate OG tags dynamically (SSR)
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params; // ✅ await aqui
  const event: Event | null = await getEventById(id);
  
  if (!event) {
    return { title: "Evento não encontrado", description: "Evento não encontrado" };
  }

  const imageUrl = event.image?.startsWith("http")
    ? event.image
    : "https://www.lucianohorta.com/default-event.jpg";

  return {
    title: `${event.title} - EventES`,
    description: event.description ?? "Confira este evento no EventES!",
    openGraph: {
      title: `${event.title} - EventES`,
      description: event.description ?? "Confira este evento no EventES!",
      url: `https://www.lucianohorta.com/event/${event.id}`,
      type: "article",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} - EventES`,
      description: event.description ?? "Confira este evento no EventES!",
      images: [imageUrl],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params; // ✅ await aqui
  const event: Event | null = await getEventById(id);

  
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col p-0">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="hidden md:block w-64 p-6">
          <Menu />
        </aside>

        <main className="p-1 mb-16 md:mb-0 w-full md:max-w-[700px]">
            {/* <span className="text-sm inline-block text-slate-600 mb-3">Detalhes do evento</span> */}
          <div className="mt-1">
            <EventCardDetails event={event} />
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
        <Menu />
      </nav>
    </div>
  );
}