import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../../core/config/app.config';
import { TrackDetail } from '../../domain/models/track-detail.model';

@Injectable({
  providedIn: 'root'
})
export class TrackAdapter {
  constructor(private http: HttpClient) {}

  getTrackDetail(trackId: string): Observable<TrackDetail> {
    const url = `${APP_CONFIG.spotify.apiBaseUrl}/tracks/${trackId}`;
    return this.http.get<TrackDetail>(url);
  }
}