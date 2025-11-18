import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RecommendationAdapter } from '../infraestructure/adapters/recommendation.adapter';
import { Recommendation } from '../domain/models/recommendation.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private recommendationsSubject = new BehaviorSubject<Recommendation[]>([]);
  public recommendations$ = this.recommendationsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private recommendationAdapter: RecommendationAdapter) {}

  getRecommendations(trackId: string, artistId?: string, limit: number = 15): void {
    console.log('📍 Obteniendo recomendaciones para track:', trackId);
    
    if (!trackId || trackId.trim() === '') {
      console.error('❌ Track ID vacío');
      return;
    }

    this.loadingSubject.next(true);

    this.recommendationAdapter.getRecommendations(trackId, artistId, limit).subscribe({
      next: (response) => {
        console.log('✅ Recomendaciones obtenidas:', response.tracks?.length);
        this.recommendationsSubject.next(response.tracks || []);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('❌ Error obteniendo recomendaciones:', {
          status: error.status,
          statusText: error.statusText,
          trackId: trackId,
          artistId: artistId
        });
        this.recommendationsSubject.next([]);
        this.loadingSubject.next(false);
      }
    });
  }
}