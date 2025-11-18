export interface Recommendation {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    images: Array<{
      url: string;
    }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}