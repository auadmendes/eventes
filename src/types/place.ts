export interface Place {
  id: string;
  place_name: string;
  city: string;

  short_description?: string;
  description?: string;
  neighborhood?: string;
  address?: string;
  location?: string;

  image?: string;
  gallery_images?: string[];
  link?: string;
  links?: { title: string; url: string }[];
  category?: string;

  phone_number?: string;
  email?: string;
  opening_hours?: string;
  price_range?: string;

  ticket_required?: boolean;
  ticket_link?: string;
  wheelchair_accessible?: boolean;
  pet_friendly?: boolean;
  parking?: string;

  rating?: number;
  tags?: string[];
  best_time_to_visit?: string;

  published?: boolean;
}
