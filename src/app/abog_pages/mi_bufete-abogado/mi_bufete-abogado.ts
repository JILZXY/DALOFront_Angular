import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BufeteService } from '../../services/bufete.service';
import { SolicitudBufeteService } from '../../services/solicitud-bufete.service';
import { AbogadoService } from '../../services/abogado.service';
import { AuthState } from '../../state/auth.state';
import { BufeteState } from '../../state/bufete.state';
import { Bufete, Abogado, SolicitudBufete, Usuario } from '../../models';

@Component({
  selector: 'app-mi-bufete-abogado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi_bufete-abogado.html',
  styleUrls: ['./mi_bufete-abogado.css']
})
export class MiBufeteAbogado implements OnInit, OnDestroy {
  bufeteActual: Bufete | null = null;
  abogadosBufete: Abogado[] = [];
  solicitudesPendientes: SolicitudBufete[] = [];
  
  // Datos separados
  usuarioActual: Usuario | null = null;
  abogadoActual: Abogado | null = null;
  
  usuarioActualId: string = '';
  esAdmin: boolean = false;
  selectedFilter: string = 'PENAL';
  
  isLoading: boolean = true;
  errorMensaje: string | null = null;

  // Mapa de especialidades
  private specialtyMap: { [key: string]: number } = {
    'PENAL': 1,
    'CIVIL': 2,
    'MERCANTIL': 3,
    'CONSTITUCIONAL': 4
  };

  private subscriptions = new Subscription();

  constructor(
    private bufeteService: BufeteService,
    private solicitudService: SolicitudBufeteService,
    private abogadoService: AbogadoService,
    private authState: AuthState,
    private bufeteState: BufeteState,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    this.usuarioActual = this.authState.currentUser;
    if (this.usuarioActual) {
      this.usuarioActualId = this.usuarioActual.idUsuario;
      
      // Cargar datos del abogado
      this.cargarDatosAbogado();
      
      // Cargar bufete desde el state
      this.cargarBufeteActual();

      // Suscribirse a abogados filtrados
        this.subscriptions.add(
            this.bufeteState.abogadosFiltrados$.subscribe(abogados => {
                this.abogadosBufete = abogados;
            })
        );

    } else {
      console.error('❌ No hay usuario en sesión');
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Cargar datos del abogado actual
   */
  cargarDatosAbogado(): void {
    const abogadoSub = this.abogadoService.getById(this.usuarioActualId).subscribe({
      next: (abogado) => {
        this.abogadoActual = abogado;
      },
      error: (error) => {
        console.error('❌ Error al cargar abogado:', error);
      }
    });

    this.subscriptions.add(abogadoSub);
  }

  /**
   * Cargar bufete del abogado actual
   */
  cargarBufeteActual(): void {
    this.isLoading = true;

    // Primero cargar mis bufetes en el state
    this.bufeteState.loadMisBufetes();

    // Luego suscribirse al state para obtener el bufete
    const bufeteSub = this.bufeteState.misBufetes$.subscribe({
      next: (bufetes) => {
        if (bufetes && bufetes.length > 0) {
          this.bufeteActual = bufetes[0];
          this.bufeteState.setBufeteActual(bufetes[0]);
          
          // Verificar si es admin
          this.esAdmin = this.bufeteActual.adminBufeteId === this.usuarioActualId;

          // Cargar abogados del bufete (inicialmente con filtro por defecto)
          this.setFilter(this.selectedFilter);

          // Si es admin, cargar solicitudes pendientes
          if (this.esAdmin) {
            this.cargarSolicitudesPendientes();
          }
          
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar bufete del state:', error);
        this.errorMensaje = 'Error al cargar el bufete.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(bufeteSub);
  }

  /**
   * Cargar solicitudes pendientes (solo admin)
   */
  cargarSolicitudesPendientes(): void {
    if (!this.bufeteActual) return;

    const solicitudesSub = this.solicitudService.getByBufeteId(this.bufeteActual.id).subscribe({
      next: (solicitudes) => {
        this.solicitudesPendientes = solicitudes.filter(s => s.estado === 'PENDIENTE');
        this.bufeteState.setSolicitudes(this.solicitudesPendientes);
      },
      error: (error) => {
        console.error('❌ Error al cargar solicitudes:', error);
      }
    });

    this.subscriptions.add(solicitudesSub);
  }

  /**
   * Cambiar filtro de especialidad
   */
  setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (this.bufeteActual) {
        const especialidadId = this.specialtyMap[filter];
        if (especialidadId) {
            this.bufeteState.getAbogadosPorEspecialidad(this.bufeteActual.id, especialidadId);
        } else {
            console.warn(`⚠️ Especialidad no mapeada: ${filter}`);
        }
    }
  }

  /**
   * Obtener usuario actual (para la card de perfil)
   */
  get currentUser(): Usuario | null {
    return this.usuarioActual;
  }

  /**
   * Aprobar solicitud
   */
  aprobarSolicitud(solicitudId: number): void {
    const sub = this.solicitudService.aprobar(solicitudId).subscribe({
      next: () => {
        alert('Solicitud aprobada');
        this.cargarSolicitudesPendientes();
        // Recargar abogados si la aprobación fue exitosa para verlo en la lista si cumple el filtro
        this.setFilter(this.selectedFilter); 
      },
      error: (error) => {
        console.error('❌ Error al aprobar solicitud:', error);
        alert('Error al aprobar la solicitud');
      }
    });

    this.subscriptions.add(sub);
  }

  /**
   * Rechazar solicitud
   */
  rechazarSolicitud(solicitudId: number): void {
    const sub = this.solicitudService.rechazar(solicitudId).subscribe({
      next: () => {
        alert('Solicitud rechazada');
        this.cargarSolicitudesPendientes();
      },
      error: (error) => {
        console.error('❌ Error al rechazar solicitud:', error);
        alert('Error al rechazar la solicitud');
      }
    });

    this.subscriptions.add(sub);
  }

  /**
   * Salir del bufete
   */
  salirDelBufete(): void {
    if (!this.bufeteActual) return;

    if (!confirm('¿Está seguro de que desea salir de este bufete?')) {
      return;
    }

    const leaveSub = this.bufeteState.salirDeBufete(this.bufeteActual.id).subscribe({
      next: () => {
        alert('Has salido del bufete exitosamente');
        this.router.navigate(['/abogado/opciones-bufete']);
      },
      error: (error) => {
        console.error('❌ Error al salir del bufete:', error);
        alert('Error al salir del bufete. Intenta nuevamente.');
      }
    });

    this.subscriptions.add(leaveSub);
  }

  /**
   * Volver a opciones
   */
  volver(): void {
    this.router.navigate(['/abogado/opciones-bufete']);
  }

  /**
   * Obtener nombre de abogado
   */
  getNombreAbogado(abogado: Abogado): string {
    return abogado.usuario?.nombre || 'Abogado';
  }

  /**
   * Obtener especialidad principal
   */
  getEspecialidadPrincipal(abogado: Abogado): string {
    if (abogado.especialidades && abogado.especialidades.length > 0) {
      return abogado.especialidades[0].nombreMateria || 'Sin especialidad';
    }
    return 'Sin especialidad';
  }

  /**
   * Obtener ubicación
   */
  getUbicacion(abogado: Abogado): string {
    return abogado.usuario?.municipio?.nombre || 'Sin ubicación';
  }

  /**
   * Obtener calificación promedio
   */
  getCalificacion(abogado: Abogado): number {
    return (abogado as any).calificacionPromedio || 0;
  }

  /**
   * Obtener especialidad del usuario actual
   */
  getEspecialidadUsuario(): string | null {
    if (!this.abogadoActual?.especialidades || this.abogadoActual.especialidades.length === 0) {
      return null;
    }
    return this.abogadoActual.especialidades[0].nombreMateria || 'Sin especialidad';
  }

  /**
   * Obtener nombre del bufete
   */
  getNombreBufete(): string {
    return this.bufeteActual?.nombre || 'Cargando bufete...';
  }
}