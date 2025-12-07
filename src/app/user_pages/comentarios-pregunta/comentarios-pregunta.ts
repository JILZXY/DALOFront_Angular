import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription, throwError, Observable, Subscriber } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

// Services & State
import { ConsultaService } from '../../services/consulta.service';
import { ConsultaState } from '../../state/consulta.state';
import { RespuestaConsultaState } from '../../state/respuesta-consulta.state';
import { CalificacionService } from '../../services/calificacion.service';

// Models
import { Consulta, RespuestaConsulta } from '../../models/consulta.model';
import { Usuario } from '../../models/usuario.model';
import { API_CONFIG } from '../../config/api.config';

@Component({
  selector: 'app-comentarios-pregunta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './comentarios-pregunta.html',
  styleUrls: ['./comentarios-pregunta.css']
})
export class ComentariosPregunta implements OnInit, OnDestroy {

  // --- State Accessors ---
  get pregunta(): Consulta | null { return this.consultaState.consultaActual; }
  get respuestas(): RespuestaConsulta[] { return this.respuestaState.respuestas; }
  get isLoading(): boolean { return this._isLoading; }

  // --- Local State ---
  private _isLoading: boolean = true;
  errorMensaje: string | null = null;
  private currentUser: Usuario | null = null;
  private preguntaId: number | null = null;

  // --- Modal State ---
  isModalVisible: boolean = false;
  respuestaParaCalificar: RespuestaConsulta | null = null;
  calificacionData = {
    claridad: '',
    tiempo: '',
    empatia: ''
  };
  errorModal: string | null = null;

  // --- Sets to track local dynamic properties ---
  respuestasCalificadasIds = new Set<number>();

  private subscriptions = new Subscription();
  private baseUrl = API_CONFIG.baseUrl; 

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private consultaService: ConsultaService,
    public consultaState: ConsultaState,
    public respuestaState: RespuestaConsultaState,
    private calificacionService: CalificacionService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 1. Get user from localStorage
    try {
      this.currentUser = JSON.parse(localStorage.getItem('usuario') || 'null');
    } catch (e) { console.error('Error al parsear usuario', e); }

    // 2. Get Question ID
    const routeSub = this.route.queryParamMap.subscribe(params => {
      const idStr = params.get('id'); 
      if (idStr) {
        this.preguntaId = Number(idStr);
        this.cargarDatos(this.preguntaId);
      } else {
        this.errorMensaje = "No se proporcionó un ID de pregunta.";
        this._isLoading = false;
      }
    });
    this.subscriptions.add(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.consultaState.setConsultaActual(null);
    this.respuestaState.clear();
  }

  cargarDatos(id: number): void {
    this._isLoading = true;
    this.errorMensaje = null;
    const usuarioId = this.currentUser?.idUsuario;

    const consulta$ = this.consultaService.getById(id);
    const respuestas$ = this.consultaService.getRespuestas(id);
    
    // Fallback/Custom logic for user ratings if "CalificacionService" doesn't support "my ratings"
    // Using raw HTTP based on previous implementation
    const calificaciones$ = usuarioId 
        ? this.http.get<any[]>(`${this.baseUrl}/calificaciones/usuario/${usuarioId}`)
        : new Observable<any[]>((sub: Subscriber<any[]>) => { sub.next([]); sub.complete(); });

    const loadSub = forkJoin({
        consulta: consulta$,
        respuestas: respuestas$,
        calificaciones: calificaciones$
    }).pipe(
        finalize(() => this._isLoading = false)
    ).subscribe({
        next: (results) => {
            this.consultaState.setConsultaActual(results.consulta);
            this.respuestaState.setRespuestas(results.respuestas);
            
            // Update Local Maps
            if (Array.isArray(results.calificaciones)) {
                 const califSet = new Set<number>(results.calificaciones.map((c: any) => Number(c.idRespuesta)));
                 this.respuestasCalificadasIds = califSet;
            }
        },
        error: (err) => {
            console.error(err);
            this.errorMensaje = "Error al cargar los datos.";
        }
    });
    
    this.subscriptions.add(loadSub);
  }

  // --- Modal Methods ---
  abrirModalCalificacion(respuesta: RespuestaConsulta): void {
    if (this.respuestasCalificadasIds.has(respuesta.idRespuesta)) return; 
    
    this.respuestaParaCalificar = respuesta;
    this.isModalVisible = true;
    this.errorModal = null;
  }

  cerrarModalCalificacion(): void {
    this.isModalVisible = false;
    this.respuestaParaCalificar = null;
    this.calificacionData = { claridad: '', tiempo: '', empatia: '' };
  }

  enviarCalificacion(): void {
    if (!this.calificacionData.claridad || !this.calificacionData.tiempo || !this.calificacionData.empatia) {
      this.errorModal = "Por favor, completa los tres criterios.";
      return;
    }
    if (!this.respuestaParaCalificar || !this.currentUser) return;

    this.errorModal = null;

    const body = {
      idUsuarioCliente: this.currentUser.idUsuario,
      idRespuesta: this.respuestaParaCalificar.idRespuesta,
      claridad: parseInt(this.calificacionData.claridad),
      tiempoRespuesta: parseInt(this.calificacionData.tiempo),
      empatia: parseInt(this.calificacionData.empatia)
    };

    // Raw HTTP call to match previous implementation
    this.http.post(`${this.baseUrl}/calificaciones`, body).subscribe({
        next: () => {
            this.cerrarModalCalificacion();
            if (this.respuestaParaCalificar) {
                this.respuestasCalificadasIds.add(this.respuestaParaCalificar.idRespuesta);
            }
            // Could reload data to show updated stars if backend updates them instantly
            if (this.preguntaId) this.cargarDatos(this.preguntaId);
        },
        error: (err) => {
            this.errorModal = "Hubo un error al enviar la calificación.";
            console.error(err);
        }
    });
  }

  // --- Actions ---
  marcarComoMejorRespuesta(idRespuesta: number): void {
    if (this.pregunta?.estado === 'cerrada') return;

    this.consultaService.marcarMejorRespuesta(idRespuesta).subscribe({
        next: () => {
            if (this.preguntaId) this.cargarDatos(this.preguntaId);
        },
        error: (err) => {
            console.error(err);
            this.errorMensaje = "Error al marcar mejor respuesta.";
        }
    });
  }

  // --- Template Helpers ---
  getEstrellas(calificacion: number): string[] {
    const estrellas: string[] = [];
    const numCalificacion = Number(calificacion) || 0; 
    const llena = Math.floor(numCalificacion);
    const media = (numCalificacion % 1 >= 0.5) ? 1 : 0;
    const vacia = 5 - llena - media;

    for (let i = 0; i < llena; i++) estrellas.push('llena');
    if (media > 0) estrellas.push('media');
    for (let i = 0; i < vacia; i++) estrellas.push('vacia');
    
    return estrellas;
  }
  
  formatTimeAgo(fecha: string): string {
    if (!fecha) return 'fecha no disponible';
    try {
      const ahora = new Date();
      const fechaPregunta = new Date(fecha);
      const diferencia = ahora.getTime() - fechaPregunta.getTime();
      const minutos = Math.floor(diferencia / 60000);
      const horas = Math.floor(diferencia / 3600000);
      const dias = Math.floor(diferencia / 86400000);
      
      if (minutos < 1) return 'hace 0 min';
      if (minutos < 60) return `hace ${minutos} min`;
      if (horas < 24) return `hace ${horas} h`;
      return `hace ${dias} d`;
    } catch (error) { return 'Fecha inválida'; }
  }

  goBack(): void {
    this.location.back();
  }
  
  // Helper to check if a response is rated by current user
  isCalificada(idRespuesta: number): boolean {
      return this.respuestasCalificadasIds.has(idRespuesta);
  }
}
