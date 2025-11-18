import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../../core/config/app.config';
import { Recommendation } from '../../domain/models/recommendation.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationAdapter {
  constructor(private http: HttpClient) {}

  getRecommendations(trackId: string, artistId?: string, limit: number = 15): Observable<any> {
    const url = `${APP_CONFIG.spotify.apiBaseUrl}/recommendations`;
    
    let params = new HttpParams();
    params = params.set('seed_tracks', trackId);
    
    if (artistId) {
      params = params.set('seed_artists', artistId);
    }
    
    params = params.set('limit', limit.toString());
    params = params.set('market', 'US');

    console.log('📤 GET:', url);
    console.log('🎵 Track ID:', trackId);
    console.log('🎤 Artist ID:', artistId || 'none');

    return this.http.get<{ tracks: Recommendation[] }>(url, { params });
  }
}