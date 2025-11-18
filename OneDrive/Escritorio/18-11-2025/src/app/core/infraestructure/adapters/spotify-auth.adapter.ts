import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../config/app.config';
import { AuthTokenResponse } from '../../domain/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthAdapter {
  
  constructor(private http: HttpClient) {}


  getToken(): Observable<AuthTokenResponse> {
    const credentials = `${APP_CONFIG.spotify.clientId}:${APP_CONFIG.spotify.clientSecret}`;
    const encodedCredentials = btoa(credentials);

    const headers = new HttpHeaders({
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', APP_CONFIG.spotify.grantType);

    return this.http.post<AuthTokenResponse>(
      APP_CONFIG.spotify.tokenUrl,
      body.toString(),
      { headers }
    );
  }
}