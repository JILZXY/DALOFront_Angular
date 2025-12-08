import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConsultaService } from '../../services/consulta.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { EstadoService } from '../../services/estado.service';
import { ConsultaState } from '../../state/consulta.state';
import { EspecialidadState } from '../../state/especialidad.state';
import { Consulta, Especialidad, Estado, Municipio } from '../../models';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './foro.html',
  styleUrls: ['./foro.css']
})
export class Foro implements OnInit, OnDestroy {
  consultas: Consulta[] = [];
  especialidades: Especialidad[] = [];
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  municipiosFiltrados: Municipio[] = [];

  materias = [
    { id: 1, nombre: 'DERECHO CIVIL', nombreMateria: 'DERECHO CIVIL', icono: '/Images/CIVIL.png' },
    { id: 2, nombre: 'DERECHO FAMILIAR', nombreMateria: 'DERECHO FAMILIAR', icono: '/Images/FAMILIAR.png' },
    { id: 3, nombre: 'DERECHO PENAL', nombreMateria: 'DERECHO PENAL', icono: '/Images/PENAL.png' },
    { id: 4, nombre: 'DERECHO LABORAL', nombreMateria: 'DERECHO LABORAL', icono: '/Images/LABORAL.png' },
    { id: 5, nombre: 'DERECHO MERCANTIL', nombreMateria: 'DERECHO MERCANTIL', icono: '/Images/MERCANTIL.png' },
    { id: 6, nombre: 'DERECHO CONSTITUCIONAL', nombreMateria: 'DERECHO CONSTITUCIONAL', icono: '/Images/CONSTITUCIONAL.png' },
    { id: 7, nombre: 'GENERAL', nombreMateria: 'GENERAL', icono: '/Images/GENERAL.png' }
  ];

  isLoading: boolean = true;
  errorMensaje: string | null = null;

  materiaDropdownAbierto: boolean = false;
  estadoDropdownAbierto: boolean = false;
  ciudadDropdownAbierto: boolean = false;

  especialidadActiva: number | null = null;
  estadoActivo: number | null = null;
  municipioActivo: number | null = null;

  private subscriptions = new Subscription();

  constructor(
    private consultaService: ConsultaService,
    private especialidadService: EspecialidadService,
    private estadoService: EstadoService,
    private consultaState: ConsultaState,
    private especialidadState: EspecialidadState,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

 
  cargarDatosIniciales(): void {
    console.log('Materias cargadas (hardcodeadas):', this.materias);

    const estadosSub = this.estadoService.getAllEstados().subscribe({
      next: (estados) => {
        console.log(' Estados cargados:', estados);
        this.estados = estados;
      },
      error: (error) => {
        console.error(' Error al cargar estados:', error);
        this.estados = [];
      }
    });
    this.subscriptions.add(estadosSub);

    const municipiosSub = this.estadoService.getAllMunicipios().subscribe({
      next: (municipios) => {
        console.log('✅ Municipios cargados:', municipios);
        this.municipios = municipios;
      },
      error: (error) => {
        console.error(' Error al cargar municipios:', error);
        this.municipios = [];
      }
    });
    this.subscriptions.add(municipiosSub);

    this.cargarConsultas();
  }

  
  cargarConsultas(): void {
  this.isLoading = true;
  this.errorMensaje = null;
  this.consultaState.setLoading(true);

  let observable;

  console.log('🔍 Filtros activos:', {
    especialidad: this.especialidadActiva,
    estado: this.estadoActivo,
    municipio: this.municipioActivo
  });

  if (this.especialidadActiva && this.estadoActivo && this.municipioActivo) {
    console.log('📡 Llamando: getByMateriaYLocalidad');
    observable = this.consultaService.getByMateriaYLocalidad(
      this.especialidadActiva,
      this.estadoActivo,
      this.municipioActivo
    );
  } else if (this.especialidadActiva) {
    console.log('📡 Llamando: getByMateria');
    observable = this.consultaService.getByMateria(this.especialidadActiva);
  } else if (this.estadoActivo || this.municipioActivo) {
    console.log('📡 Llamando: getByLocalidad');
    observable = this.consultaService.getByLocalidad(
      this.estadoActivo || undefined,
      this.municipioActivo || undefined
    );
  } else {
    console.log('📡 Llamando: getAll');
    observable = this.consultaService.getAll();
  }

  const consultasSub = observable.subscribe({
    next: (consultas) => {
      console.log('✅ Consultas recibidas del backend:', consultas);
      console.log('📊 Total consultas:', consultas.length);

     this.consultas = consultas;


      console.log('✅ Consultas después de filtrar por estado:', this.consultas);
      console.log('📊 Total después de filtrar:', this.consultas.length);

      this.isLoading = false;
      this.consultaState.setLoading(false);
    },
    error: (error) => {
      console.error(' Error al cargar consultas:', error);
      this.errorMensaje = 'No se pudieron cargar las consultas. Intenta nuevamente.';
      this.isLoading = false;
      this.consultaState.setLoading(false);
    }
  });

  this.subscriptions.add(consultasSub);
}

  
  verDetalle(id: number): void {
    this.router.navigate(['/abogado/consultas'], { queryParams: { id: id } });
  }

  toggleDropdown(tipo: 'materia' | 'estado' | 'ciudad'): void {
    if (tipo === 'materia') {
      this.materiaDropdownAbierto = !this.materiaDropdownAbierto;
      this.estadoDropdownAbierto = false;
      this.ciudadDropdownAbierto = false;
    } else if (tipo === 'estado') {
      this.estadoDropdownAbierto = !this.estadoDropdownAbierto;
      this.materiaDropdownAbierto = false;
      this.ciudadDropdownAbierto = false;
    } else if (tipo === 'ciudad') {
      this.ciudadDropdownAbierto = !this.ciudadDropdownAbierto;
      this.materiaDropdownAbierto = false;
      this.estadoDropdownAbierto = false;
    }
  }

  
  seleccionarEspecialidad(id: number): void {
    this.especialidadActiva = id;
    this.materiaDropdownAbierto = false;
    this.cargarConsultas();
  }

 
  seleccionarEstado(id: number): void {
    this.estadoActivo = id;
    this.municipioActivo = null;
    
    this.municipiosFiltrados = this.municipios.filter(
      m => m.estadoId === this.estadoActivo
    );
    
    this.estadoDropdownAbierto = false;
    this.cargarConsultas();
  }

  
  seleccionarMunicipio(id: number): void {
    this.municipioActivo = id;
    this.ciudadDropdownAbierto = false;
    this.cargarConsultas();
  }


  limpiarFiltros(): void {
    this.especialidadActiva = null;
    this.estadoActivo = null;
    this.municipioActivo = null;
    this.municipiosFiltrados = [];
    this.cargarConsultas();
  }

  limpiarMateria(): void {
    this.especialidadActiva = null;
    this.materiaDropdownAbierto = false;
    this.cargarConsultas();
  }

  
  getNombreEspecialidad(id: number | null): string {
    if (!id) return 'MATERIA';
    const especialidad = this.especialidades.find(e => e.id === id);
    return especialidad ? especialidad.nombreMateria : 'MATERIA';
  }

  getNombreEstado(id: number | null): string {
    if (!id) return 'ESTADO';
    const estado = this.estados.find(e => e.id === id);
    return estado ? estado.nombre : 'ESTADO';
  }

  getNombreMunicipio(id: number | null): string {
    if (!id) return 'CIUDAD';
    const municipio = this.municipios.find(m => m.id === id);
    return municipio ? municipio.nombre : 'CIUDAD';
  }

  
  formatTime(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  
  getMateriaConsulta(consulta: Consulta): string {
    if (!consulta.especialidades || consulta.especialidades.length === 0) {
      return 'General';
    }
    return consulta.especialidades[0].nombreMateria;
  }

  getMunicipioConsulta(consulta: any): string {
  if (consulta.municipio && typeof consulta.municipio === 'object') {
    return consulta.municipio.nombre || '';
  }
  
  if (consulta.municipioId && typeof consulta.municipioId === 'number') {
    const municipio = this.municipios.find(m => m.id === consulta.municipioId);
    return municipio ? municipio.nombre : '';
  }
  
  return '';
}
}