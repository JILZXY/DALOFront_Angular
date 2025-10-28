import { Component, output, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Materia {
  id: string;
  nombre: string;
  subtitulo?: string;
  icono: string;
}

@Component({
  selector: 'app-materia-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materia-cards.html',
  styleUrls: ['./materia-cards.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class MateriaCards {
  readonly areaSelected = output<string | null>();

  readonly selectedId = signal<string | null>(null);

  readonly materias: Materia[] = [
    { id: 'area-civil', nombre: 'DERECHO CIVIL', icono: '/Images/CIVIL.png' },
    { id: 'area-familiar', nombre: 'DERECHO FAMILIAR', icono: '/Images/FAMILIAR.png' },
    { id: 'area-penal', nombre: 'DERECHO PENAL', icono: '/Images/PENAL.png' },
    { id: 'area-laboral', nombre: 'DERECHO LABORAL', icono: '/Images/LABORAL.png' },
    { id: 'area-mercantil', nombre: 'DERECHO MERCANTIL', icono: '/Images/MERCANTIL.png' },
    { id: 'area-constitucional', nombre: 'DERECHO CONSTITUCIONAL', subtitulo: '', icono: '/Images/CONSTITUCIONAL.png' },
    { id: 'area-general', nombre: 'GENERAL', subtitulo: '(Desconozco la materia que requiero)', icono: '/Images/GENERAL.png' },
  ];

  constructor(private router: Router) {
    effect(() => {
      const currentId = this.selectedId();
      if (currentId) {
        const idArea = currentId.replace('area-', '');
        this.areaSelected.emit(idArea);
      } else {
        this.areaSelected.emit(null);
      }
    });
  }

  handleAreaClick(id: string): void {
    if (this.selectedId() === id) {
      this.selectedId.set(null); 
    } else {
      this.selectedId.set(id); 
    }
  }

  isSelected(id: string): boolean {
    return this.selectedId() === id;
  }
}