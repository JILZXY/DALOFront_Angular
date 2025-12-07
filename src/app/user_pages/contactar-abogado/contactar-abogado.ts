import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AbogadoService } from '../../services/abogado.service';
import { EstadoService } from '../../services/estado.service';
import { Abogado, Estado, Municipio } from '../../models';

@Component({
  selector: 'app-contactar-abogado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactar-abogado.html',
  styleUrls: ['./contactar-abogado.css']
})
export class ContactarAbogado implements OnInit { 
  abogados: Abogado[] = [];
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  
  isLoading: boolean = true;
  errorMensaje: string = '';

  materiaDropdownAbierto: boolean = false;
  estadoDropdownAbierto: boolean = false;
  ciudadDropdownAbierto: boolean = false;
  
  materiaActiva: number | null = null;
  estadoActivo: number | null = null;
  ciudadActiva: number | null = null;
  terminoBusqueda: string = '';

  // Mapping for filters
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
    private estadoService: EstadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEstados();
    this.cargarAbogados();
  }

  cargarEstados(): void {
    this.estadoService.getAllEstados().subscribe({
      next: (data) => this.estados = data,
      error: (err) => console.error('Error al cargar estados', err)
    });
  }

  cargarMunicipios(estadoId: number): void {
    this.estadoService.getAllMunicipios(estadoId).subscribe({
      next: (data) => this.municipios = data,
      error: (err) => console.error('Error al cargar municipios', err)
    });
  }

  cargarAbogados(): void {
    this.isLoading = true;
    this.errorMensaje = '';
    this.cerrarDropdowns();

    if (this.terminoBusqueda.trim()) {
      this.abogadoService.searchByName(this.terminoBusqueda).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
      return;
    }

    const filters: any = {};

    if (this.materiaActiva && this.materiaActiva !== 7) {
      filters.materiaId = this.materiaActiva;
    }

    if (this.estadoActivo) {
      filters.estadoId = this.estadoActivo;
    }

    if (this.ciudadActiva) {
      filters.municipioId = this.ciudadActiva;
    }

    const hasFilters = Object.keys(filters).length > 0;

    if (hasFilters) {
       this.abogadoService.filtrar(filters).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
    } else {
      // If no specific filters (or General selected with no other filters), get all
      this.abogadoService.getAll().subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
    }
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
    // If input value is a number (from dynamic list if we had one) or string key
    // Here we use the map
    this.materiaActiva = this.materiasMap[materiaKey] || parseInt(materiaKey) || null;
    this.cargarAbogados();
  }
  
  filtrarPorEstado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const estadoId = parseInt(input.value);
    this.estadoActivo = estadoId;
    this.ciudadActiva = null; // Reset city when state changes
    this.municipios = []; // Clear municipalities
    if (estadoId) {
      this.cargarMunicipios(estadoId);
    }
    this.cargarAbogados();
  }

  filtrarPorCiudad(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.ciudadActiva = parseInt(input.value);
    this.cargarAbogados();
  }
  
  limpiarFiltros(): void {
    this.materiaActiva = null;
    this.estadoActivo = null;
    this.ciudadActiva = null;
    this.terminoBusqueda = '';
    this.municipios = []; // Clear municipalities
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