import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Artist } from '../../../domain/models/artist.model';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (artist) {
      <div class="artist-card" (click)="selectArtist()">
        <div class="card-image">
          <img 
            [src]="artist.images?.[0]?.url || 'assets/placeholder.png'" 
            [alt]="artist.name"
            class="image"
          />
          <button class="play-button" (click)="playArtist($event)">
            ▶️
          </button>
        </div>
        
        <div class="card-content">
          <h3 class="artist-name">{{ artist.name }}</h3>
          <p class="artist-type">Artista</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .artist-card {
      background: #1e293b;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .artist-card:hover {
      background: #334155;
      transform: translateY(-4px);
    }

    .card-image {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      margin-bottom: 12px;
      border-radius: 50%;
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

    .artist-card:hover .play-button {
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
      text-align: center;
    }

    .artist-name {
      font-size: 14px;
      font-weight: 600;
      color: white;
      margin: 0 0 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .artist-type {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }
  `]
})
export class ArtistCardComponent {
  @Input() artist!: Artist;
  @Output() artistSelected = new EventEmitter<Artist>();

  constructor(private router: Router) {}

  selectArtist(): void {
    if (this.artist?.id) {
      // Puedes agregar una ruta para artistas después
      console.log('Artista:', this.artist.name);
    }
  }

  playArtist(event: Event): void {
    event.stopPropagation();
    this.artistSelected.emit(this.artist);
  }
}