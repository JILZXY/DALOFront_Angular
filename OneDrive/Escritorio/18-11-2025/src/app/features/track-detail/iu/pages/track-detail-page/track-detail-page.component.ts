import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackService } from '../../../services/track.service';
import { RecommendationService } from '../../../services/recommendation.service';
import { TrackInfoComponent } from '../../components/track-info/track-info.component';
import { AlbumCoverComponent } from '../../components/album-cover/album-cover.component';
import { AudioPlayerComponent } from '../../components/audio-player/audio-player.component';
import { RecommendationSidebarComponent } from '../../components/recommendation-sidebar/recommendation-sidebar.component';

@Component({
  selector: 'app-track-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    TrackInfoComponent,
    AlbumCoverComponent,
    AudioPlayerComponent,
    RecommendationSidebarComponent
  ],
  template: `
    <div class="track-detail-container">
      <!-- Back button -->
      <button (click)="goBack()" class="back-button">
        ← Volver
      </button>

      <!-- Main content -->
      <div class="main-content">
        <!-- Loading state -->
        @if (trackService.loading$ | async) {
          <div class="loading">
            <div class="spinner"></div>
            <p>Cargando track...</p>
          </div>
        } @else {
          <!-- Album cover -->
          <app-album-cover [track]="trackService.track$ | async"></app-album-cover>

          <!-- Track info -->
          <app-track-info [track]="trackService.track$ | async"></app-track-info>

          <!-- Audio player -->
          <app-audio-player [track]="trackService.track$ | async"></app-audio-player>
        }
      </div>

      <!-- Recommendations sidebar - Deshabilitado por ahora -->
      <!-- <app-recommendation-sidebar
        [recommendations]="recommendationService.recommendations$ | async"
        (recommendationSelected)="onRecommendationSelected($event)"
      ></app-recommendation-sidebar> -->
    </div>
  `,
  styles: [`
    .track-detail-container {
      display: flex;
      min-height: 100vh;
      background: #0f172a;
      color: white;
      gap: 20px;
      padding: 20px;
    }

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      background: #1db954;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      z-index: 10;
    }

    .back-button:hover {
      background: #1ed760;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      padding-top: 60px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 20px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(29, 185, 84, 0.2);
      border-top-color: #1db954;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loading p {
      color: #94a3b8;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .track-detail-container {
        flex-direction: column;
        padding: 20px 10px;
      }

      .main-content {
        padding-top: 80px;
      }
    }
  `]
})
export class TrackDetailPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public trackService: TrackService,
    public recommendationService: RecommendationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const trackId = params['id'];
      if (trackId) {
        console.log('📍 Cargando track:', trackId);
        this.trackService.getTrackDetail(trackId);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onRecommendationSelected(recommendationId: string): void {
    console.log('🎵 Navegando a recomendación:', recommendationId);
    this.router.navigate(['/track', recommendationId]);
  }
}