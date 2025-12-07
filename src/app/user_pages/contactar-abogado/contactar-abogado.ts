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

  // Modal State
  selectedAbogado: Abogado | null = null;
  isPerfilModalOpen: boolean = false;

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

    // 1. Search by Name
    if (this.terminoBusqueda.trim()) {
      this.abogadoService.searchByName(this.terminoBusqueda).subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
      return;
    }

    // 2. Filter by Materia (Specific Endpoint)
    // Note: If both materia AND location are selected, we prioritize one or the other
    // based on typical user flow, or fall back to generic filter if API doesn't support combo on specific endpoints.
    // The requirement implies specific endpoints for specific actions.
    // If Materia is active (and not General which is 7 in this map)
    if (this.materiaActiva && this.materiaActiva !== 7) {
       // If we strictly follow "Use Endpoint X for Materia", we use it:
       // However, if Location is ALSO active, the specific endpoint might not handle it.
       // Assuming specific endpoints are mutually exclusive or primary:
       this.abogadoService.getByMateria(this.materiaActiva).subscribe({
           next: (data) => {
               // Client-side intersection if location is also selected (optional refinement)
               if (this.estadoActivo) {
                   data = data.filter(a => a.usuario?.municipio?.estado?.id === this.estadoActivo);
                   if (this.ciudadActiva) {
                       data = data.filter(a => a.usuario?.municipio?.id === this.ciudadActiva);
                   }
               }
               this.handleSuccess(data);
           },
           error: (err) => this.handleError(err)
       });
       return;
    }

    // 3. Filter by Location (Specific Endpoint)
    if (this.estadoActivo) {
        this.abogadoService.getByLocalidad(this.estadoActivo, this.ciudadActiva || undefined).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
        return;
    }

    // 4. Default: Get All
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
    
    // Clear other filters when switching main filter type if desired, 
    // but usually users expect additive. 
    // For specific endpoints, we treat Materia as primary if selected.
    
    this.materiaActiva = this.materiasMap[materiaKey] || parseInt(materiaKey) || null;
    this.cargarAbogados();
  }
  
  filtrarPorEstado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const estadoId = parseInt(input.value);
    
    // If switching to Location filter and Materia was active, we might want to clear it 
    // OR keep it and let the client-side filtering handle it. 
    // For now, let's reset Materia if Location is explicitly chosen to avoid confusion
    // about which specific endpoint is driving the data.
    if (this.materiaActiva) {
        // Option: this.materiaActiva = null; 
        // But users might want "Criminal Lawyers in Jalisco".
        // My implementation above handles Materia FIRST, then filters by location client-side.
        // If Materia is NULL, I use Location endpoint.
    }

    this.estadoActivo = estadoId;
    this.ciudadActiva = null; 
    this.municipios = []; 
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
    this.municipios = []; 
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

  // --- Profile Modal ---
  verPerfil(abogado: Abogado): void {
     this.selectedAbogado = abogado;
     this.isPerfilModalOpen = true;
  }

  cerrarPerfil(): void {
      this.isPerfilModalOpen = false;
      this.selectedAbogado = null;
  }
}
