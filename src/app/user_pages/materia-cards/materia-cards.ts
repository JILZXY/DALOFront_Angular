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
    { id: '1', nombre: 'DERECHO PENAL', icono: '/Images/PENAL.png' },
    { id: '2', nombre: 'DERECHO CIVIL', icono: '/Images/CIVIL.png' },
    { id: '3', nombre: 'DERECHO PROCESAL', icono: '/Images/PROCESAL.png' },
    { id: '4', nombre: 'DERECHO LABORAL', icono: '/Images/LABORAL.png' },
    { id: '5', nombre: 'DERECHO MERCANTIL', icono: '/Images/MERCANTIL.png' },
    { id: '6', nombre: 'DERECHO CONSTITUCIONAL', subtitulo: '', icono: '/Images/CONSTITUCIONAL.png' },
    { id: '7', nombre: 'GENERAL', subtitulo: '(Desconozco la materia que requiero)', icono: '/Images/GENERAL.png' },
  ];

  constructor(private router: Router) {
    effect(() => {
      const currentId = this.selectedId();
      this.areaSelected.emit(currentId);
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