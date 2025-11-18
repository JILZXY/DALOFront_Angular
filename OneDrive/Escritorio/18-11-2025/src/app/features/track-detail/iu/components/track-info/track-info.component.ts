import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackDetail } from '../../../domain/models/track-detail.model';

@Component({
  selector: 'app-track-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (track) {
      <div class="track-info">
        <h1 class="track-name">{{ track.name }}</h1>
        <p class="artist-name">
          @for (artist of track.artists; track artist.id) {
            {{ artist.name }}@if (!$last) { , }
          }
        </p>
        <p class="album-name">{{ track.album.name }}</p>
        <p class="release-date">{{ track.album.release_date | slice:0:4 }}</p>
      </div>
    }
  `,
  styles: [`
    .track-info {
      text-align: center;
    }

    .track-name {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 10px 0;
    }

    .artist-name {
      font-size: 18px;
      color: #94a3b8;
      margin: 0 0 10px 0;
    }

    .album-name {
      font-size: 16px;
      color: #64748b;
      margin: 0 0 10px 0;
    }

    .release-date {
      font-size: 14px;
      color: #475569;
      margin: 0;
    }
  `]
})
export class TrackInfoComponent {
  @Input() track: TrackDetail | null = null;
}
