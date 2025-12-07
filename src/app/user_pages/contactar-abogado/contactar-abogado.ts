import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AbogadoService } from '../../services/abogado.service';
import { AbogadoState } from '../../state/abogado.state';
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
    private abogadoState: AbogadoState,
    private estadoService: EstadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEstados();
    
    // Subscribe to State
    this.abogadoState.abogados$.subscribe(abogados => {
        this.abogados = abogados;
        if (this.isLoading && abogados.length > 0) {
            this.isLoading = false; 
        }
    });

    // Also subscribe to loading to sync valid state
    this.abogadoState.loading$.subscribe(loading => {
        this.isLoading = loading;
    });

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
    this.errorMensaje = '';
    this.cerrarDropdowns();

    // 1. Search by Name (Still direct or migrate? User asked for *filters* to use state methods)
    if (this.terminoBusqueda.trim()) {
      this.isLoading = true;
      this.abogadoService.searchByName(this.terminoBusqueda).subscribe({
        next: (data) => {
             this.abogadoState.setAbogados(data);
             this.handleSuccess(data); // Sync local state/error msg
        },
        error: (err) => this.handleError(err)
      });
      return;
    }

    // 2. Filter by Materia (Using State Method)
    if (this.materiaActiva && this.materiaActiva !== 7) {
       this.abogadoState.loadByEspecialidad(this.materiaActiva);
       // Note: The previous client-side filtering for Location+Materia is removed 
       // to strictly use the requested endpoints. If user wants that combo, 
       // they likely need a specific API or we accept that "Materia" filter overrides "Location".
       // Or we can client-side filter in the Subscription if needed, but the State replaces the list.
       return;
    }

    // 3. Filter by Location (Using State Methods)
    if (this.ciudadActiva) {
        this.abogadoState.loadByMunicipio(this.ciudadActiva);
        return;
    }

    if (this.estadoActivo) {
        this.abogadoState.loadByEstado(this.estadoActivo);
        return;
    }

    // 4. Default: Get All
    this.isLoading = true;
    this.abogadoService.getAll().subscribe({
        next: (data) => {
            this.abogadoState.setAbogados(data);
            this.handleSuccess(data);
        },
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
    
    this.materiaActiva = this.materiasMap[materiaKey] || parseInt(materiaKey) || null;
    this.cargarAbogados();
  }
  
  filtrarPorEstado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const estadoId = parseInt(input.value);
    
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
