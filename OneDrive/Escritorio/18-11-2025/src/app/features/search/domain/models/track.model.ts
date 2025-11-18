export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  type: 'artist';
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface Album {
  id: string;
  name: string;
  type: 'album';
  release_date: string;
  total_tracks: number;
  images: Image[];
  artists: Artist[];
  external_urls: {
    spotify: string;
  };
}

export interface Track {
  id: string;
  name: string;
  type: 'track';
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  uri: string;
  track_number: number;
  disc_number: number;
  artists: Artist[];
  album: Album;
  external_urls: {
    spotify: string;
  };
  external_ids: {
    isrc: string;
  };
}

export interface TracksResponse {
  href: string;
  items: Track[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}