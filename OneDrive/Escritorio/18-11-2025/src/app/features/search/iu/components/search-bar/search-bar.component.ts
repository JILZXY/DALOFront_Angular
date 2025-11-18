import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @Output() search = new EventEmitter<string>();

  searchQuery = '';

  onSearchChange(): void {
    // El servicio manejará el debounce
    this.search.emit(this.searchQuery);
  }

  onSearchSubmit(): void {
    // Búsqueda inmediata
    if (this.searchQuery.trim().length >= 2) {
      this.search.emit(this.searchQuery);
    }
  }

  onClear(): void {
    this.searchQuery = '';
    this.search.emit('');
    this.searchInput?.nativeElement.focus();
  }
}
