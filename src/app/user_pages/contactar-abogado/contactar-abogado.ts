import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AbogadoService } from '../../services/abogado.service';
import { Abogado } from '../../models';

@Component({
  selector: 'app-contactar-abogado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactar-abogado.html',
  styleUrls: ['./contactar-abogado.css']
})
export class ContactarAbogado implements OnInit { 
  abogados: Abogado[] = [];
  isLoading: boolean = true;
  errorMensaje: string = '';

  materiaDropdownAbierto: boolean = false;
  estadoDropdownAbierto: boolean = false;
  ciudadDropdownAbierto: boolean = false;
  
  materiaActiva: number | null = null;
  estadoActivo: number | null = null;
  ciudadActiva: number | null = null;
  terminoBusqueda: string = '';

  // Mapping for filters (hardcoded for now as per previous context)
  materiasMap: { [key: string]: number } = {
    'penal': 1,
    'civil': 2,
    'procesal': 3,
    'laboral': 4,
    'mercantil': 5,
    'constitucional': 6,
    'general': 7
  };

  constructor(
    private abogadoService: AbogadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAbogados();
  }

  cargarAbogados(): void {
    this.isLoading = true;
    this.errorMensaje = '';
    this.cerrarDropdowns();

    // If search term exists, use search
    if (this.terminoBusqueda.trim()) {
      this.abogadoService.searchByName(this.terminoBusqueda).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
      return;
    }

    // If filters exist, use filter
    if (this.materiaActiva || this.estadoActivo || this.ciudadActiva) {
      this.abogadoService.filtrar({
        materiaId: this.materiaActiva || undefined,
        estadoId: this.estadoActivo || undefined,
        municipioId: this.ciudadActiva || undefined
      }).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
      return;
    }

    // Default: get all
    this.abogadoService.getAll().subscribe({
      next: (data) => this.handleSuccess(data),
      error: (err) => this.handleError(err)
    });
  }

  private handleSuccess(data: Abogado[]): void {
    this.abogados = data;
    this.isLoading = false;
    if (this.abogados.length === 0) {
      this.errorMensaje = 'No se encontraron abogados con esos criterios.';
    }
  }

  private handleError(err: any): void {
    console.error('Error cargando abogados:', err);
    this.errorMensaje = 'Ocurrió un error al cargar la lista de abogados.';
    this.isLoading = false;
  }

  toggleDropdown(dropdown: 'materia' | 'estado' | 'ciudad'): void {
    this.materiaDropdownAbierto = (dropdown === 'materia') ? !this.materiaDropdownAbierto : false;
    this.estadoDropdownAbierto = (dropdown === 'estado') ? !this.estadoDropdownAbierto : false;
    this.ciudadDropdownAbierto = (dropdown === 'ciudad') ? !this.ciudadDropdownAbierto : false;
  }
  
  cerrarDropdowns(): void {
    this.materiaDropdownAbierto = false;
    this.estadoDropdownAbierto = false;
    this.ciudadDropdownAbierto = false;
  }

  filtrarPorMateria(event: Event): void {
    const input = event.target as HTMLInputElement;
    const materiaKey = input.value;
    this.materiaActiva = this.materiasMap[materiaKey] || null;
    this.cargarAbogados();
  }
  
  filtrarPorEstado(event: Event): void {
    // Placeholder logic for state ID mapping if needed, assuming value is ID for now or ignored
    // Since the HTML uses 'chiapas', we might need a map or update HTML to use IDs.
    // For now, let's assume we don't have state IDs ready and just log it, or use a dummy ID if backend requires number.
    // The user didn't provide state/city IDs, so I'll comment this out or use a dummy.
    console.log('Filtro estado no implementado completamente sin IDs');
    // this.estadoActivo = ...
    // this.cargarAbogados();
  }

  filtrarPorCiudad(event: Event): void {
     // Similar to state, need IDs.
     console.log('Filtro ciudad no implementado completamente sin IDs');
  }
  
  limpiarFiltros(): void {
    this.materiaActiva = null;
    this.estadoActivo = null;
    this.ciudadActiva = null;
    this.terminoBusqueda = '';
    this.cargarAbogados();
  }

  buscarPorNombre(): void {
    this.cargarAbogados();
  }
  contactarAbogado(abogado: Abogado): void {
    const confirmacion = window.confirm(
      `Al iniciar un chat con ${abogado.usuario?.nombre || 'el abogado'}, él podrá ver tu nombre completo.\n\n¿Deseas continuar?`
    );

    if (confirmacion) {
      this.router.navigate(['/usuario/chat'], { 
        queryParams: { 
          abogadoId: abogado.idAbogado || abogado.idUsuario, 
          nombre: `${abogado.usuario?.nombre}` 
        } 
      });
    }
  }

  verPerfil(abogado: Abogado): void {
     const id = abogado.idAbogado || abogado.idUsuario;
     this.router.navigate(['/usuario/ver-perfil-abogado', id]);
  }
}