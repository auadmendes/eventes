// --- City ---
export interface City {
  id: string;
  name: string;
}

// --- Neighborhood ---
export interface Neighborhood {
  id: string;
  name: string;
  city?: City; // optional, since sometimes you only load id/name
}