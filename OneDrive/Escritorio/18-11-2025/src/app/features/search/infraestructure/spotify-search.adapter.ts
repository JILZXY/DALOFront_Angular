
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APP_CONFIG } from '../../../core/config/app.config';
import { SpotifySearchResponse } from '../domain/models/search-result.model';

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchAdapter {
  private apiUrl = APP_CONFIG.spotify.apiBaseUrl;

  constructor(private http: HttpClient) {}
  
  search(
    query: string,
    type: string = 'track,artist,album',
    limit: number = 20
  ): Observable<SpotifySearchResponse> {
    return this.http.get<SpotifySearchResponse>(
      `${this.apiUrl}/search`,
      {
        params: {
          q: query,
          type: type,
          limit: limit.toString()
        }
      }
    );
  }
}