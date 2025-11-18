import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackDetail } from '../../../domain/models/track-detail.model';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (track) {
      <div class="player-container">
        <div class="player-info">
          <p class="info-text">🎵 Este track no tiene preview disponible</p>
        </div>

        <div class="track-details">
          <p class="detail-row">
            <span class="label">Duración:</span>
            <span class="value">{{ track.duration_ms }}</span>
          </p>
          <p class="detail-row">
            <span class="label">Popularidad:</span>
            <span class="value">{{ track.popularity }}%</span>
          </p>
          <p class="detail-row">
            <span class="label">Explícito:</span>
            <span class="value">{{ track.explicit ? 'Sí' : 'No' }}</span>
          </p>
        </div>

        <a 
          [href]="track.external_urls.spotify" 
          target="_blank" 
          rel="noopener"
          class="spotify-button"
        >
          🎵 Abrir en Spotify para escuchar
        </a>
      </div>
    }
  `,
  styles: [`
    .player-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 100%;
      max-width: 500px;
    }

    .player-info {
      background: #1e293b;
      border-radius: 12px;
      padding: 20px;
      width: 100%;
      text-align: center;
      border-left: 4px solid #1db954;
    }

    .info-text {
      color: #94a3b8;
      font-size: 16px;
      margin: 0;
    }

    .track-details {
      background: #1e293b;
      border-radius: 12px;
      padding: 20px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 10px 0;
      border-bottom: 1px solid #334155;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      color: #64748b;
      font-size: 14px;
      font-weight: 600;
    }

    .value {
      color: #1db954;
      font-size: 14px;
      font-weight: 700;
    }

    .spotify-button {
      background: #1db954;
      color: white;
      padding: 14px 40px;
      border-radius: 24px;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-block;
      border: none;
      font-size: 16px;
    }

    .spotify-button:hover {
      background: #1ed760;
      transform: scale(1.05);
    }

    .spotify-button:active {
      transform: scale(0.98);
    }
  `]
})
export class AudioPlayerComponent {
  @Input() track: TrackDetail | null = null;
}