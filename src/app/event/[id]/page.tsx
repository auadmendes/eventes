import EventCard from "@/components/envents/EventCard";
import { getEventById } from "@/actions/events"; 
import { Event } from "@/types/event";
import { Menu } from "@/components/Menu";
import { Header } from "@/components/Header";

interface EventPageProps {
  params: Promise<{ id: string }>; // 👈 params is now async
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params; // 👈 must await before using
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
