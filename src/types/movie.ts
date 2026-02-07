export interface Movie {
  id: number;
  title: string;
  genre: string[];
  mood: string[];
  releaseYear: number;
  language: string;
  actors: string[];
  rating: number;
  poster: string;
  description: string;
}

export interface Filters {
  genre: string;
  mood: string;
  yearRange: [number, number];
  language: string;
  actor: string;
}
