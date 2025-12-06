import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RespuestaConsultaService } from '../../services/respuesta-consulta.service';
import { CalificacionService } from '../../services/calificacion.service';
import { ConsultaService } from '../../services/consulta.service';
import { AuthState } from '../../state/auth.state';
import { RespuestaConsultaState } from '../../state/respuesta-consulta.state';
import { RespuestaConsulta, Calificacion, Consulta } from '../../models';

interface RespuestaConCalificacion extends RespuestaConsulta {
  calificacion?: Calificacion;
  consulta?: Consulta;
}

@Component({
  selector: 'app-mis-respuestas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-respuestas.html',
  styleUrls: ['./mis-respuestas.css']
})
export class MisRespuestas implements OnInit, OnDestroy {
  respuestas: RespuestaConCalificacion[] = [];
  isLoading: boolean = true;
  errorMensaje: string | null = null;
  
  mostrarModal: boolean = false;
  modalTipo: 'con-calificacion' | 'sin-calificacion' = 'sin-calificacion';
  calificacionSeleccionada: Calificacion | null = null;

  private subscriptions = new Subscription();
  private abogadoId: string = '';

  constructor(
    private respuestaService: RespuestaConsultaService,
    private calificacionService: CalificacionService,
    private consultaService: ConsultaService,
    private authState: AuthState,
    private respuestaState: RespuestaConsultaState
  ) {}

  ngOnInit(): void {
    this.abogadoId = this.authState.currentUser?.idUsuario || '';
    
    if (this.abogadoId) {
      this.cargarMisRespuestas();
    } else {
      this.errorMensaje = 'No se pudo identificar el usuario.';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  
  cargarMisRespuestas(): void {
    this.isLoading = true;
    this.errorMensaje = null;

    const respuestasSub = this.respuestaService.getByAbogadoId(this.abogadoId).subscribe({
      next: (respuestas) => {
        this.respuestas = respuestas;
        this.respuestaState.setMisRespuestas(respuestas);
        
        this.cargarConsultas();
        this.cargarCalificaciones();
      },
      error: (error) => {
        console.error('Error al cargar respuestas:', error);
        this.errorMensaje = 'No se pudieron cargar tus respuestas.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(respuestasSub);
  }

  
  cargarConsultas(): void {
    let consultasCargadas = 0;
    const totalConsultas = this.respuestas.length;

    if (totalConsultas === 0) {
      this.isLoading = false;
      return;
    }

    this.respuestas.forEach((respuesta, index) => {
      const consultaSub = this.consultaService.getById(respuesta.idConsulta).subscribe({
        next: (consulta) => {
          this.respuestas[index] = {
            ...respuesta,
            consulta: consulta
          };
          consultasCargadas++;
          
          if (consultasCargadas === totalConsultas) {
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error(`Error al cargar consulta ${respuesta.idConsulta}:`, error);
          consultasCargadas++;
          
          if (consultasCargadas === totalConsultas) {
            this.isLoading = false;
          }
        }
      });
      this.subscriptions.add(consultaSub);
    });
  }

  
  cargarCalificaciones(): void {
    this.respuestas.forEach((respuesta, index) => {
      const calificacionSub = this.calificacionService.getPromediosPorRespuesta(respuesta.idRespuesta).subscribe({
        next: (data: any) => {
          if (data && data.calificacion) {
            this.respuestas[index].calificacion = data.calificacion;
          }
        },
        error: (error) => {
          console.log(`Respuesta ${respuesta.idRespuesta} sin calificación`);
        }
      });
      this.subscriptions.add(calificacionSub);
    });
  }

  
  verCalificacion(respuesta: RespuestaConCalificacion): void {
    if (respuesta.calificacion) {
      this.calificacionSeleccionada = respuesta.calificacion;
      this.modalTipo = 'con-calificacion';
    } else {
      this.calificacionSeleccionada = null;
      this.modalTipo = 'sin-calificacion';
    }
    this.mostrarModal = true;
  }

  
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  
  getEstrellas(promedio: number): string[] {
    const estrellas = [];
    const enteras = Math.floor(promedio);
    const media = promedio % 1 >= 0.5;
    
    for (let i = 0; i < enteras; i++) estrellas.push('★');
    if (media) estrellas.push('½');
    while (estrellas.length < 5) estrellas.push('☆');
    
    return estrellas;
  }

  
  formatTime(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  getTituloConsulta(respuesta: RespuestaConCalificacion): string {
    return respuesta.consulta?.titulo || `Consulta #${respuesta.idConsulta}`;
  }

  
  getPreguntaConsulta(respuesta: RespuestaConCalificacion): string {
    return respuesta.consulta?.pregunta || 'Cargando...';
  }

  
  getPromedioCalificacion(calificacion: Calificacion): number {
    const { profesionalismo, atencion, claridad, empatia } = calificacion;
    return (profesionalismo + atencion + claridad + empatia) / 4;
  }
}