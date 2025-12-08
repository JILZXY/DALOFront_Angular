import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BufeteService } from '../../services/bufete.service';
import { SolicitudBufeteService } from '../../services/solicitud-bufete.service';
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
  currentUserData: Usuario | null = null;
  
  usuarioActualId: string = '';
  esAdmin: boolean = false;
  selectedFilter: string = 'PENAL';
  
  isLoading: boolean = true;
  errorMensaje: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private bufeteService: BufeteService,
    private solicitudService: SolicitudBufeteService,
    private authState: AuthState,
    private bufeteState: BufeteState,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    const currentUser = this.authState.currentUser;
    if (currentUser) {
      this.usuarioActualId = currentUser.idUsuario;
      this.currentUserData = currentUser;
      console.log('✅ Usuario actual cargado:', currentUser);
    } else {
      console.error('❌ No hay usuario en sesión');
    }

    this.cargarBufeteActual();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Cargar bufete del abogado actual
   */
  cargarBufeteActual(): void {
    this.isLoading = true;

    const bufeteSub = this.bufeteService.getByAbogadoId(this.usuarioActualId).subscribe({
      next: (bufetes) => {
        if (bufetes && bufetes.length > 0) {
          this.bufeteActual = bufetes[0];
          this.bufeteState.setBufeteActual(bufetes[0]);
          
          // Verificar si es admin
          this.esAdmin = this.bufeteActual.adminBufeteId === this.usuarioActualId;
          console.log('✅ Bufete cargado:', this.bufeteActual);
          console.log('✅ Es admin:', this.esAdmin);

          // Cargar abogados del bufete
          this.cargarAbogadosBufete();

          // Si es admin, cargar solicitudes pendientes
          if (this.esAdmin) {
            this.cargarSolicitudesPendientes();
          }
        } else {
          console.log('⚠️ No tiene bufete, redirigiendo...');
          this.router.navigate(['/abogado/opciones-bufete']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar bufete:', error);
        this.errorMensaje = 'Error al cargar el bufete.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(bufeteSub);
  }

  /**
   * Cargar abogados del bufete
   */
  cargarAbogadosBufete(): void {
    if (!this.bufeteActual) return;

    const abogadosSub = this.bufeteService.getAbogadosByBufete(this.bufeteActual.id).subscribe({
      next: (abogados) => {
        this.abogadosBufete = abogados;
        console.log('✅ Abogados del bufete:', abogados);
      },
      error: (error) => {
        console.error('❌ Error al cargar abogados:', error);
      }
    });

    this.subscriptions.add(abogadosSub);
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
        console.log('✅ Solicitudes pendientes:', this.solicitudesPendientes);
      },
      error: (error) => {
        console.error('❌ Error al cargar solicitudes:', error);
      }
    });

    this.subscriptions.add(solicitudesSub);
  }

  /**
   * Filtrar abogados por especialidad
   */
  get filteredAbogados(): Abogado[] {
    if (!this.abogadosBufete || this.abogadosBufete.length === 0) {
      return [];
    }

    return this.abogadosBufete.filter(abogado => {
      if (!abogado.especialidades || abogado.especialidades.length === 0) {
        return false;
      }
      
      return abogado.especialidades.some(esp => 
        esp.nombreMateria?.toUpperCase().includes(this.selectedFilter)
      );
    });
  }

  /**
   * Cambiar filtro de especialidad
   */
  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  /**
   * Obtener usuario actual (para la card de perfil)
   */
  get currentUser(): Usuario | null {
    return this.currentUserData;
  }

  /**
   * Aprobar solicitud
   */
  aprobarSolicitud(solicitudId: number): void {
    const sub = this.solicitudService.aprobar(solicitudId).subscribe({
      next: () => {
        alert('Solicitud aprobada');
        this.cargarSolicitudesPendientes();
        this.cargarAbogadosBufete();
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
   * Salir del bufete (para todos)
   */
  salirDelBufete(): void {
    if (!this.bufeteActual) return;

    if (!confirm('¿Está seguro de que desea salir de este bufete?')) {
      return;
    }

    const leaveSub = this.bufeteService.salirDeBufete(this.bufeteActual.id, this.usuarioActualId).subscribe({
      next: () => {
        alert('Has salido del bufete exitosamente');
        this.bufeteState.setBufeteActual(null);
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
  if (!this.currentUserData?.abogado?.especialidades || 
      this.currentUserData.abogado.especialidades.length === 0) {
    return null;
  }
  return this.currentUserData.abogado.especialidades[0].nombreMateria || 'Sin especialidad';
}
}