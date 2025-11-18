import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Track } from '../../../domain/models/track.model';
import { DurationPipe } from '../../../../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule, DurationPipe],
  template: `
    @if (track) {
      <div class="track-card" (click)="onCardClick()">
        <div class="card-image">
          <img 
            [src]="track?.album?.images?.[0]?.url || 'assets/placeholder.png'" 
            [alt]="track?.name"
            class="image"
          />
          <button class="play-button" (click)="playTrack($event)">
            ▶️
          </button>
        </div>
        
        <div class="card-content">
          <h3 class="track-name">{{ track.name }}</h3>
          <p class="artist-name">
            @for (artist of track.artists; track artist.id) {
              {{ artist.name }}@if (!$last) { • }
            }
          </p>
          <p class="duration">{{ track.duration_ms | duration }}</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .track-card {
      background: #1e293b;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .track-card:hover {
      background: #334155;
      transform: translateY(-4px);
    }

    .card-image {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      margin-bottom: 12px;
      border-radius: 4px;
      overflow: hidden;
    }

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-button {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: #1db954;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .track-card:hover .play-button {
      opacity: 1;
    }

    .play-button:hover {
      background: #1ed760;
      transform: scale(1.1);
    }

    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .track-name {
      font-size: 14px;
      font-weight: 600;
      color: white;
      margin: 0 0 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .artist-name {
      font-size: 12px;
      color: #94a3b8;
      margin: 0 0 8px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .duration {
      font-size: 11px;
      color: #64748b;
      margin: 0;
    }
  `]
})
export class TrackCardComponent {
  @Input() track!: Track;
  @Output() trackSelected = new EventEmitter<Track>();

  constructor(private router: Router) {}

  onCardClick(): void {
    if (this.track?.id) {
      console.log('🎵 Navegando a track:', this.track.id);
      this.router.navigate(['/track', this.track.id]);
    }
  }

  playTrack(event: Event): void {
    event.stopPropagation();
    console.log('▶️ Play:', this.track.name);
    this.trackSelected.emit(this.track);
  }
}