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
  release_date_precision: 'year' | 'month' | 'day';
  total_tracks: number;
  images: Image[];
  artists: Artist[];
  album_type: 'album' | 'single' | 'compilation';
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface AlbumsResponse {
  href: string;
  items: Album[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}