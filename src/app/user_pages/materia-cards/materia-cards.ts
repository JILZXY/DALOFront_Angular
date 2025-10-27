import { Component, output, signal, effect } from '@angular/core';
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
  changeDetection: 1, 
})
export class MateriaCards {
  readonly materiaSeleccionada = output<string>();

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
      if (this.selectedId()) {
        const idArea = this.selectedId()!.replace('area-', '');
        this.materiaSeleccionada.emit(idArea);
      }
    });
  }

  /**
   * Maneja el clic en una tarjeta de materia.
   * @param id 
   */
  handleAreaClick(id: string): void {
    // Si ya está seleccionada, la deselecciona (opcional)
    // Si es un componente de selección única, siempre selecciona la nueva.
    this.selectedId.set(id);
  }

  /**
   * Verifica si una materia está seleccionada.
   * @param id El ID de la materia.
   * @returns true si está seleccionada.
   */
  isSelected(id: string): boolean {
    return this.selectedId() === id;
  }
}
