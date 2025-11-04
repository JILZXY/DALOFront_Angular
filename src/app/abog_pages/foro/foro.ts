import { Component } from '@angular/core';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.html',
  styleUrls: ['./foro.css']
})
export class Foro {
  materiaDropdownOpen = false;
  estadoDropdownOpen = false;
  ciudadDropdownOpen = false;

  materiaSeleccionada: string | null = null;
  estadoSeleccionado: string | null = null;
  ciudadSeleccionada: string | null = null;

  toggleMateriaDropdown(event: Event) {
    event.stopPropagation();
    this.materiaDropdownOpen = !this.materiaDropdownOpen;
    this.estadoDropdownOpen = false;
    this.ciudadDropdownOpen = false;
  }

  toggleEstadoDropdown(event: Event) {
    event.stopPropagation();
    this.estadoDropdownOpen = !this.estadoDropdownOpen;
    this.materiaDropdownOpen = false;
    this.ciudadDropdownOpen = false;
  }

  toggleCiudadDropdown(event: Event) {
    event.stopPropagation();
    this.ciudadDropdownOpen = !this.ciudadDropdownOpen;
    this.materiaDropdownOpen = false;
    this.estadoDropdownOpen = false;
  }

  closeAllDropdowns() {
    this.materiaDropdownOpen = false;
    this.estadoDropdownOpen = false;
    this.ciudadDropdownOpen = false;
  }

  selectMateria(value: string) {
    this.materiaSeleccionada = value;
    console.log('Materia seleccionada:', value);
  }

  selectEstado(value: string) {
    this.estadoSeleccionado = value;
    console.log('Estado seleccionado:', value);
  }

  selectCiudad(value: string) {
    this.ciudadSeleccionada = value;
    console.log('Ciudad seleccionada:', value);
  }

  limpiarFiltros() {
    this.materiaSeleccionada = null;
    this.estadoSeleccionado = null;
    this.ciudadSeleccionada = null;
    console.log('Filtros limpiados');
  }
}