export interface Place {
  id: string;
  place_name: string;
  short_description?: string;
  description?: string;
  city: string;
  neighborhood?: string;
  address?: string;
  location?: string;
  image?: string;
  gallery_images?: string[];
  link?: string;
  category?: string;
  ticket_required?: boolean;
  wheelchair_accessible?: boolean;
  pet_friendly?: boolean;
  tags?: string[];
}
