import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Album } from '../../../domain/models/album.model';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (album) {
      <div class="album-card" (click)="selectAlbum()">
        <div class="card-image">
          <img 
            [src]="album?.images?.[0]?.url || 'assets/placeholder.png'" 
            [alt]="album?.name"
            class="image"
          />
          <button class="play-button" (click)="playAlbum($event)">
            ▶️
          </button>
        </div>
        
        <div class="card-content">
          <h3 class="album-name">{{ album.name }}</h3>
          <p class="artist-name">
            @for (artist of album.artists; track artist.id) {
              {{ artist.name }}@if (!$last) { • }
            }
          </p>
          <p class="release-date">{{ album.release_date | slice:0:4 }}</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .album-card {
      background: #1e293b;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .album-card:hover {
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

    .album-card:hover .play-button {
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

    .album-name {
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

    .release-date {
      font-size: 11px;
      color: #64748b;
      margin: 0;
    }
  `]
})
export class AlbumCardComponent {
  @Input() album!: Album;
  @Output() albumSelected = new EventEmitter<Album>();

  constructor(private router: Router) {}

  selectAlbum(): void {
    if (this.album?.id) {
      // Puedes agregar una ruta para álbumes después
      console.log('Álbum:', this.album.name);
    }
  }

  playAlbum(event: Event): void {
    event.stopPropagation();
    this.albumSelected.emit(this.album);
  }
}