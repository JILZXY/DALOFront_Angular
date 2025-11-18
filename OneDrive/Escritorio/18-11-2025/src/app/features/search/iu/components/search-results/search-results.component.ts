// 📊 Search Results Component - src/app/features/search/components/search-results/search-results.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Track } from '../../../domain/models/track.model';
import { Artist } from '../../../domain/models/artist.model';
import { Album } from '../../../domain/models/album.model';
import { TrackCardComponent } from '../track-card/track-card.component';
import { ArtistCardComponent } from '../artist-card/artist-card.component';
import { AlbumCardComponent } from '../album-card/album-card.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TrackCardComponent,
    ArtistCardComponent,
    AlbumCardComponent
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {
  @Input() tracks: Track[] = [];
  @Input() artists: Artist[] = [];
  @Input() albums: Album[] = [];
  @Input() loading = false;

  @Output() trackSelected = new EventEmitter<Track>();
  @Output() artistSelected = new EventEmitter<Artist>();
  @Output() albumSelected = new EventEmitter<Album>();

  get hasResults(): boolean {
    return (
      (this.tracks && this.tracks.length > 0) ||
      (this.artists && this.artists.length > 0) ||
      (this.albums && this.albums.length > 0)
    );
  }

  onTrackSelected(track: Track): void {
    this.trackSelected.emit(track);
  }

  onArtistSelected(artist: Artist): void {
    this.artistSelected.emit(artist);
  }

  onAlbumSelected(album: Album): void {
    this.albumSelected.emit(album);
  }
}