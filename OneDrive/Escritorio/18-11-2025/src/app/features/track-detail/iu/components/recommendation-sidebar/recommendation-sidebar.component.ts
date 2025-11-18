import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recommendation } from '../../../domain/models/recommendation.model';

@Component({
  selector: 'app-recommendation-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="recommendation-sidebar">
      <h2 class="sidebar-title">Recomendado</h2>
      <div class="recommendations-list">
        @for (rec of recommendations; track rec.id) {
          <div class="recommendation-item" (click)="selectRecommendation(rec.id)">
            <img 
              [src]="rec.album.images[0]?.url" 
              [alt]="rec.name"
              class="rec-cover"
            />
            <div class="rec-info">
              <p class="rec-name">{{ rec.name }}</p>
              <p class="rec-artist">
                @for (artist of rec.artists; track artist.id) {
                  {{ artist.name }}@if (!$last) { , }
                }
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .recommendation-sidebar {
      width: 400px;
      background: #1e293b;
      border-radius: 8px;
      padding: 20px;
      height: fit-content;
      position: sticky;
      top: 20px;
    }

    .sidebar-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 20px 0;
      color: #1db954;
    }

    .recommendations-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 600px;
      overflow-y: auto;
    }

    .recommendation-item {
      display: flex;
      gap: 10px;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .recommendation-item:hover {
      background: rgba(29, 185, 84, 0.1);
    }

    .rec-cover {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      object-fit: cover;
    }

    .rec-info {
      flex: 1;
    }

    .rec-name {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 5px 0;
      color: white;
    }

    .rec-artist {
      font-size: 12px;
      color: #94a3b8;
      margin: 0;
    }
  `]
})
export class RecommendationSidebarComponent {
  @Input() recommendations: Recommendation[] | null = null;
  @Output() recommendationSelected = new EventEmitter<string>();

  selectRecommendation(id: string): void {
    this.recommendationSelected.emit(id);
  }
}
