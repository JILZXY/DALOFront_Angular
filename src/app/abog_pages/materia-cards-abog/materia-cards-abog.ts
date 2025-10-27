import { Component, output, signal, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Materia {
  id: string;
  nombre: string;
  subtitulo?: string;
  icono: string;
}

@Component({
  selector: 'app-materia-cards-abog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materia-cards-abog.html',
  styleUrls: ['./materia-cards-abog.css'],
  changeDetection: 1, 
})
export class MateriaCardsAbog {
  readonly maxSelections = input(3);

  readonly materiasSeleccionadas = output<string[]>();

  readonly selectedIds = signal<string[]>([]);

  readonly materias: Materia[] = [
    { id: 'area-civil', nombre: 'DERECHO CIVIL', icono: '/Images/CIVIL.png' },
    { id: 'area-familiar', nombre: 'DERECHO FAMILIAR', icono: '/Images/FAMILIAR.png' },
    { id: 'area-penal', nombre: 'DERECHO PENAL', icono: '/Images/PENAL.png' },
    { id: 'area-laboral', nombre: 'DERECHO LABORAL', icono: '/Images/LABORAL.png' },
    { id: 'area-mercantil', nombre: 'DERECHO MERCANTIL', icono: '/Images/MERCANTIL.png' },
    { id: 'area-constitucional', nombre: 'DERECHO CONSTITUCIONAL', subtitulo: '', icono: '/Images/CONSTITUCIONAL.png' },
    { id: 'area-general', nombre: 'GENERAL', subtitulo: '(Sin especialidad)', icono: '/Images/GENERAL.png' },
  ];

  constructor() {
    effect(() => {
      const selectedAreas = this.selectedIds().map(id => id.replace('area-', ''));
      this.materiasSeleccionadas.emit(selectedAreas);
    });
  }
  
  /**
   * Maneja el clic en una tarjeta de materia para alternar la selección.
   * @param id El ID de la materia clicada.
   */
  handleAreaClick(id: string): void {
    const currentSelection = this.selectedIds();
    const isSelected = currentSelection.includes(id);
    const currentMax = this.maxSelections();

    if (isSelected) {
      this.selectedIds.set(currentSelection.filter(item => item !== id));
      
    } else {
      if (currentSelection.length < currentMax) {
        this.selectedIds.set([...currentSelection, id]);
        
      } else {
        
        console.warn(`Límite de ${currentMax} selecciones alcanzado.`);
        const msg = document.getElementById('limit-message');
        if (msg) {
            msg.style.opacity = '1';
            msg.style.transform = 'translateY(0)';
            setTimeout(() => {
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(-10px)';
            }, 3000);
        }
      }
    }
  }

  /**
   * Verifica si una materia está seleccionada.
   * @param id El ID de la materia.
   * @returns true si está seleccionada.
   */
  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  
  getSelectionStatus(): { current: number, max: number, remaining: number } {
    const current = this.selectedIds().length;
    const max = this.maxSelections();
    const remaining = max - current;
    return { current, max, remaining };
  }
}
