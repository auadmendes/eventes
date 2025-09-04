import EventCard from "@/components/envents/EventCard";
import { getEventById } from "@/actions/events"; 
import { Event } from "@/types/event";
import { Menu } from "@/components/Menu";
import { Header } from "@/components/Header";

interface EventPageProps {
  params: { id: string }; // ✅ sync, not Promise
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);

  if (!event) {
    return {
      title: "Event not found - EventES",
      description: "Este evento não foi encontrado.",
    };
  }

  return {
    title: `${event.title} - EventES`,
    description: event.description || "Confira este evento incrível no EventES!",
    openGraph: {
      title: event.title,
      description: event.description || "Confira este evento incrível no EventES!",
      url: `https://www.lucianohorta.com/event/${event.id}`,
      images: [
        {
          url: event.image || "https://www.lucianohorta.com/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description || "Confira este evento incrível no EventES!",
      images: [event.image || "https://www.lucianohorta.com/default-og-image.jpg"],
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = params; // ✅ no await here
  const event: Event | null = await getEventById(id);

  if (!event) return <p>Event not found.</p>;

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="hidden md:block w-64 p-6">
          <Menu />
        </aside>

        <main className="p-6 mb-16 md:mb-0 w-full md:max-w-[800px]">
          <EventCard event={event} />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
        <Menu />
      </nav>
    </div>
  );
}
