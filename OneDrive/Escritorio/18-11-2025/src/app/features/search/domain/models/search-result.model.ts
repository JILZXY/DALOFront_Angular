import { Track } from './track.model';
import { Artist } from './artist.model';
import { Album } from './album.model';

export interface SearchResult {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
}

export interface SpotifySearchResponse {
  tracks?: {
    href: string;
    items: Track[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  artists?: {
    href: string;
    items: Artist[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  albums?: {
    href: string;
    items: Album[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}