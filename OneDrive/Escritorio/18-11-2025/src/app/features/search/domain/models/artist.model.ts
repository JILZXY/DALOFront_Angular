export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface Artist {
  id: string;
  name: string;
  type: 'artist';
  popularity: number;
  genres: string[];
  followers: {
    href: string | null;
    total: number;
  };
  images: Image[];
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface ArtistsResponse {
  href: string;
  items: Artist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}