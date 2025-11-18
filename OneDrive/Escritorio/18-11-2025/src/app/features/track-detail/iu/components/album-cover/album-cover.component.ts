import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackDetail } from '../../../domain/models/track-detail.model';

@Component({
  selector: 'app-album-cover',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (track) {
      <div class="album-cover-container">
        <img 
          [src]="track.album.images[0]?.url" 
          [alt]="track.album.name"
          class="album-cover"
        />
      </div>
    }
  `,
  styles: [`
    .album-cover-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .album-cover {
      width: 400px;
      height: 400px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
  `]
})
export class AlbumCoverComponent {
  @Input() track: TrackDetail | null = null;
}