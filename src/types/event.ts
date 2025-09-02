export interface Like {
  id: string;
  user_id: string;
  event_id: string;
}

export interface Event {
  id: string;
  title: string;
  link: string;
  image: string;
  date: string;
  end_date: string | null;
  UF: string;
  category: string;
  font: string;
  site: string;
  createdAt: string;
  updatedAt: string;
  extra: string[];
  highlighted?: boolean | null;  // 👈 allow null
  likes?: { id: string; user_id: string; event_id: string }[];
}


export type NewEvent = Omit<Event, "id" | "likes" | "highlighted">;