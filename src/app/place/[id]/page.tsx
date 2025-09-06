import { getPlaceById } from "@/actions/places"; 
import { Place } from "@/types/place";
import { Menu } from "@/components/Menu";
import { Header } from "@/components/Header";
import { Metadata } from "next";
import PlaceCard from "@/components/Places/Placecard";


export const dynamic = "force-dynamic"; // ✅ force SSR

interface PlacePageProps {
  params: Promise<{ id: string }>; // ✅ Promise
}

// ✅ Generate OG tags dynamically (SSR)
export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { id } = await params;
  const place: Place | null = await getPlaceById(id);
  
  if (!place) {
    return { title: "Lugar não encontrado", description: "Lugar não encontrado" };
  }

  const imageUrl = place.image?.startsWith("http")
    ? place.image
    : "https://www.lucianohorta.com/default-place.jpg";

  return {
    title: `${place.place_name} - EventES`,
    description: place.description ?? "Confira este lugar no EventES!",
    openGraph: {
      title: `${place.place_name} - EventES`,
      description: place.description ?? "Confira este lugar no EventES!",
      url: `https://www.lucianohorta.com/place/${place.id}`,
      type: "article",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: place.place_name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${place.place_name} - EventES`,
      description: place.description ?? "Confira este lugar no EventES!",
      images: [imageUrl],
    },
  };
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = await params;
  const place: Place | null = await getPlaceById(id);

  if (!place) return <p>Place not found.</p>;

  return (
    <div className="min-h-screen bg-background-default text-text-dark flex flex-col p-0">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="hidden md:block w-64 p-6">
          <Menu />
        </aside>

        <main className="p-1 mb-16 md:mb-0 w-full md:max-w-[700px]">
          <div className="mt-1">
            <PlaceCard place={place} />
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-paper p-4">
        <Menu />
      </nav>
    </div>
  );
}
