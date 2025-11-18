import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from '../../../services/search.service';
import { Track } from '../../../domain/models/track.model';
import { Artist } from '../../../domain/models/artist.model';
import { Album } from '../../../domain/models/album.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchResultsComponent } from '../../components/search-results/search-results.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SidebarComponent,
    SearchBarComponent,
    SearchResultsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tracks: Track[] = [];
  artists: Artist[] = [];
  albums: Album[] = [];

  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.results$.subscribe(results => {
      this.tracks = results.tracks;
      this.artists = results.artists;
      this.albums = results.albums;
    });

    this.loading$ = this.searchService.loading$;
    this.error$ = this.searchService.error$;
  }

  onSearch(query: string): void {
    this.searchService.performSearch(query);
  }

  onCardClick(event: Event): void {
    const target = event.target as HTMLElement;
    const trackCard = target.closest('app-track-card');

    if (trackCard) {
      if (target.closest('.play-button')) {
        return;
      }
      console.log('Track card clicked');
    }
  }
}