import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TrackAdapter } from '../infraestructure/adapters/track.adapter';
import { TrackDetail } from '../domain/models/track-detail.model';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private trackSubject = new BehaviorSubject<TrackDetail | null>(null);
  public track$ = this.trackSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private trackAdapter: TrackAdapter) {}

  getTrackDetail(trackId: string): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.trackAdapter.getTrackDetail(trackId).subscribe({
      next: (track) => {
        console.log('✅ Track detail obtenido:', track.name);
        this.trackSubject.next(track);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('❌ Error obteniendo track detail:', error);
        this.errorSubject.next('Error al cargar el track');
        this.loadingSubject.next(false);
      }
    });
  }
}