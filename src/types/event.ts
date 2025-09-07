export interface Like {
  id: string;
  user_id: string;
  event_id: string;
}

export interface UsefulLink {
  title: string;
  url: string;
}

export interface Event {
  id: string;
  link: string;
  title: string;
  date: string;
  end_date: string | null;
  UF: string;
  category: string;
  font: string;
  image: string;
  location: string | null;
  highlighted?: boolean | null;
  distances?: string;
  description?: string;
  extra?: string[];
  likes?: Like[];
  links?: UsefulLink[]; // ✅ added
}

export type NewEvent = Omit<Event, "id" | "likes" | "highlighted">;

