import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConsultaService } from '../../services/consulta.service';
import { RespuestaConsultaService } from '../../services/respuesta-consulta.service';
import { ReporteService } from '../../services/reporte.service';
import { AbogadoService } from '../../services/abogado.service';
import { AuthState } from '../../state/auth.state';
import { ConsultaState } from '../../state/consulta.state';
import { RespuestaConsultaState } from '../../state/respuesta-consulta.state';
import { Consulta, RespuestaConsulta, MotivoReporte, Abogado } from '../../models';

@Component({
  selector: 'app-consul-resp',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './consul-resp.html',
  styleUrls: ['./consul-resp.css']
})
export class ConsulResp implements OnInit, OnDestroy {
  consulta: Consulta | null = null;
  respuestas: RespuestaConsulta[] = [];
  motivosReporte: MotivoReporte[] = [];
  abogadosMap: Map<string, Abogado> = new Map(); 
  
  isLoading: boolean = true;
  errorMensaje: string | null = null;
  
  currentUserId: string = '';
  consultaId: number | null = null;
  
  nuevaRespuesta: string = '';
  enviandoRespuesta: boolean = false;
  errorRespuesta: string | null = null;

  isReportModalVisible: boolean = false;
  motivoReporteId: number | null = null;
  comentariosReporte: string = '';
  enviandoReporte: boolean = false;
  errorReporte: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private consultaService: ConsultaService,
    private respuestaService: RespuestaConsultaService,
    private reporteService: ReporteService,
    private abogadoService: AbogadoService, 
    private authState: AuthState,
    private consultaState: ConsultaState,
    private respuestaState: RespuestaConsultaState,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authState.currentUser?.idUsuario || '';

    const routeSub = this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.consultaId = parseInt(id, 10);
        this.cargarDatos();
      } else {
        this.errorMensaje = 'No se especificó una consulta.';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(routeSub);

    this.cargarMotivosReporte();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

 
  cargarDatos(): void {
    if (!this.consultaId) return;

    this.isLoading = true;
    this.errorMensaje = null;

    const consultaSub = this.consultaService.getById(this.consultaId).subscribe({
      next: (consulta) => {
        this.consulta = consulta;
        this.consultaState.setConsultaActual(consulta);
      },
      error: (error) => {
        console.error('Error al cargar consulta:', error);
        this.errorMensaje = 'No se pudo cargar la consulta.';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(consultaSub);

    const respuestasSub = this.respuestaService.getByConsultaId(this.consultaId).subscribe({
      next: (respuestas) => {
        this.respuestas = respuestas;
        this.respuestaState.setRespuestas(respuestas);
        this.cargarNombresAbogados(); 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar respuestas:', error);
        this.isLoading = false;
      }
    });
    this.subscriptions.add(respuestasSub);
  }

  
  cargarNombresAbogados(): void {
    const abogadosIds = [...new Set(this.respuestas.map(r => r.idAbogado).filter(id => id))];
    
    abogadosIds.forEach(idAbogado => {
      if (idAbogado && !this.abogadosMap.has(idAbogado)) {
        const abogadoSub = this.abogadoService.getById(idAbogado).subscribe({
          next: (abogado) => {
            this.abogadosMap.set(idAbogado, abogado);
          },
          error: (error) => {
            console.error(`Error al cargar abogado ${idAbogado}:`, error);
            this.abogadosMap.set(idAbogado, {
              idUsuario: idAbogado,
              nombre: 'Abogado',
              cedulaProfesional: '',
              biografia: null,
              calificacionPromedio: 0,
              especialidades: []
            } as Abogado);
          }
        });
        this.subscriptions.add(abogadoSub);
      }
    });
  }

  
  cargarMotivosReporte(): void {
    const motivosSub = this.reporteService.getMotivosReporte().subscribe({
      next: (motivos) => {
        this.motivosReporte = motivos;
      },
      error: (error) => {
        console.error('Error al cargar motivos de reporte:', error);
      }
    });
    this.subscriptions.add(motivosSub);
  }

  
  enviarRespuesta(): void {
    if (!this.nuevaRespuesta.trim() || !this.consultaId) return;

    this.enviandoRespuesta = true;
    this.errorRespuesta = null;

    const payload = {
      respuesta: this.nuevaRespuesta.trim()
    };

    const enviarSub = this.respuestaService.create(this.consultaId, payload).subscribe({
      next: (respuesta) => {
        this.respuestas.push(respuesta);
        this.respuestaState.addRespuesta(respuesta);
        
        if (respuesta.idAbogado && !this.abogadosMap.has(respuesta.idAbogado)) {
          this.abogadoService.getById(respuesta.idAbogado).subscribe({
            next: (abogado) => {
              this.abogadosMap.set(respuesta.idAbogado!, abogado);
            }
          });
        }
        
        this.nuevaRespuesta = '';
        this.enviandoRespuesta = false;

        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      },
      error: (error) => {
        console.error('Error al enviar respuesta:', error);
        this.errorRespuesta = 'No se pudo enviar la respuesta. Intenta nuevamente.';
        this.enviandoRespuesta = false;
      }
    });
    this.subscriptions.add(enviarSub);
  }

 
  abrirModalReporte(): void {
    this.isReportModalVisible = true;
    this.motivoReporteId = null;
    this.comentariosReporte = '';
    this.errorReporte = null;
  }

  
  cerrarModalReporte(): void {
    this.isReportModalVisible = false;
  }

  
  enviarReporte(): void {
    if (!this.motivoReporteId) {
      this.errorReporte = 'Selecciona un motivo de reporte.';
      return;
    }

    if (!this.consulta?.idUsuario) {
      this.errorReporte = 'No se pudo identificar al usuario a reportar.';
      return;
    }

    this.enviandoReporte = true;
    this.errorReporte = null;

    const payload = {
      usuarioReportaId: this.currentUserId,
      usuarioReportadoId: this.consulta.idUsuario,
      motivoReporteId: this.motivoReporteId,
      consultaId: this.consultaId!,
      comentarios: this.comentariosReporte.trim()
    };

    const reporteSub = this.reporteService.create(payload).subscribe({
      next: () => {
        alert('Reporte enviado correctamente. Será revisado por un administrador.');
        this.enviandoReporte = false;
        this.cerrarModalReporte();
      },
      error: (error) => {
        console.error('Error al enviar reporte:', error);
        this.errorReporte = 'No se pudo enviar el reporte. Intenta nuevamente.';
        this.enviandoReporte = false;
      }
    });
    this.subscriptions.add(reporteSub);
  }

 
  goBack(): void {
    this.router.navigate(['/abogado/foro']);
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

 
  getMateria(): string {
    if (!this.consulta?.especialidades || this.consulta.especialidades.length === 0) {
      return 'General';
    }
    return this.consulta.especialidades[0].nombreMateria;
  }

  
  isMiRespuesta(respuesta: RespuestaConsulta): boolean {
    return respuesta.idAbogado === this.currentUserId;
  }

  
getNombreAbogado(respuesta: RespuestaConsulta): string {
  if (!respuesta.idAbogado) return 'Abogado';
  
  const abogado = this.abogadosMap.get(respuesta.idAbogado);
  
  if (!abogado) return 'Cargando...';
  
  return abogado.usuario?.nombre ? `Lic. ${abogado.usuario.nombre}` : 'Lic. Abogado';
}
}
