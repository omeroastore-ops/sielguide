export type PlaceCategory =
  | "restaurant"
  | "cafe"
  | "hotel"
  | "aktivitaet"
  | "event"
  | "natur"
  | "sehenswuerdigkeit"
  | "shopping"
  | "familie"
  | "romantisch";

export interface OpeningHours {
  mo?: string;
  di?: string;
  mi?: string;
  do?: string;
  fr?: string;
  sa?: string;
  so?: string;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  type: string;
  category: PlaceCategory;
  description: string;
  short_description: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  reviews_count: number;
  price_level: 1 | 2 | 3;
  tags: string[];
  images: number[];
  phone?: string;
  email?: string;
  website_url?: string;
  external_booking_url?: string;
  opening_hours: OpeningHours;
  is_hot: boolean;
  is_featured: boolean;
  distance_m: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  place_id: string;
  rating: number;
  text: string;
  tags: string[];
  created_at: string;
}

export interface Route {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Leicht" | "Mittel" | "Schwer";
  stops: string[];
  images: number[];
  tags: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: number;
  external_url?: string;
}

export interface Offer {
  id: string;
  place_id: string;
  title: string;
  description: string;
  valid_until: string;
  external_url?: string;
}

export type ChatMessage =
  | { id: string; role: "user"; text: string; createdAt: number }
  | {
      id: string;
      role: "assistant";
      text: string;
      places?: Place[];
      createdAt: number;
    };
