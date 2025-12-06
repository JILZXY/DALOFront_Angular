import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AbogadoService } from '../../services/abogado.service';
import { CalificacionService } from '../../services/calificacion.service';
import { RespuestaConsultaService } from '../../services/respuesta-consulta.service';
import { AuthState } from '../../state/auth.state';
import { AbogadoState } from '../../state/abogado.state';
import { Abogado } from '../../models';

@Component({
  selector: 'app-perfil-abogado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-abogado.html',
  styleUrls: ['./perfil-abogado.css']
})
export class PerfilAbogado implements OnInit, OnDestroy {
  abogado: Abogado | null = null;
  isLoading: boolean = true;
  errorMensaje: string | null = null;

  nombreAbogado: string = '';
  especializacionAbogado: string = '';
  ubicacionAbogado: string = '';
  descripcionAbogado: string = '';

  calificaciones = {
    general: '0.0',
    profesionalismo: '0.0',
    atencion: '0.0',
    claridad: '0.0',
    empatia: '0.0'
  };

  totalRespuestas: number = 0;
  totalLikes: number = 0;

  private subscriptions = new Subscription();
  private abogadoId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private abogadoService: AbogadoService,
    private calificacionService: CalificacionService,
    private respuestaService: RespuestaConsultaService,
    private authState: AuthState,
    private abogadoState: AbogadoState
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.abogadoId = id;
      } else {
        this.abogadoId = this.authState.currentUser?.idUsuario || '';
      }

      if (this.abogadoId) {
        this.cargarPerfil();
      } else {
        this.errorMensaje = 'No se pudo identificar el abogado.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarPerfil(): void {
    this.isLoading = true;
    this.errorMensaje = null;

    const abogadoSub = this.abogadoService.getById(this.abogadoId).subscribe({
      next: (abogado) => {
        this.abogado = abogado;
        this.abogadoState.setAbogadoActual(abogado);

        this.nombreAbogado = abogado.usuario?.nombre || 'Abogado';
        this.descripcionAbogado = abogado.biografia || 'Sin descripción disponible.';

        if (abogado.especialidades && abogado.especialidades.length > 0) {
          this.especializacionAbogado = abogado.especialidades.map(e => e.nombreMateria).join(', ');
        } else {
          this.especializacionAbogado = 'No especificado';
        }

         if (abogado.usuario?.municipio?.nombre) {
          this.ubicacionAbogado = abogado.usuario.municipio.nombre;
        } else {
          this.ubicacionAbogado = 'No especificado';
        }

        this.cargarEstadisticas();
        this.cargarCalificaciones();
      },
      error: (error) => {
        console.error('Error al cargar abogado:', error);
        this.errorMensaje = 'No se pudo cargar el perfil del abogado.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(abogadoSub);
  }

  cargarEstadisticas(): void {
    const respuestasSub = this.respuestaService.getTotalByAbogado(this.abogadoId).subscribe({
      next: (data) => {
        this.totalRespuestas = data.total || 0;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });

    this.subscriptions.add(respuestasSub);
  }

  
  cargarCalificaciones(): void {
    const calificacionSub = this.calificacionService.getByAbogadoId(this.abogadoId).subscribe({
      next: (calificaciones) => {
        if (calificaciones && calificaciones.length > 0) {
          const total = calificaciones.length;
          let sumProfesionalismo = 0;
          let sumAtencion = 0;
          let sumClaridad = 0;
          let sumEmpatia = 0;

          calificaciones.forEach(cal => {
            sumProfesionalismo += cal.profesionalismo;
            sumAtencion += cal.atencion;
            sumClaridad += cal.claridad;
            sumEmpatia += cal.empatia;
          });

          this.calificaciones.profesionalismo = (sumProfesionalismo / total).toFixed(1);
          this.calificaciones.atencion = (sumAtencion / total).toFixed(1);
          this.calificaciones.claridad = (sumClaridad / total).toFixed(1);
          this.calificaciones.empatia = (sumEmpatia / total).toFixed(1);

          const general = (
            (sumProfesionalismo + sumAtencion + sumClaridad + sumEmpatia) / (total * 4)
          );
          this.calificaciones.general = general.toFixed(1);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar calificaciones:', error);
        this.isLoading = false;
      }
    });

    this.subscriptions.add(calificacionSub);
  }

  
  contactar(): void {
    this.router.navigate(['/abogado/chat'], {
      queryParams: { abogadoId: this.abogadoId }
    });
  }

  
  volver(): void {
    this.router.navigate(['/abogado/foro']);
  }
}