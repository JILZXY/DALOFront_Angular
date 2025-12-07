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
  public currentUser: Usuario | null = null; // Public for template
  private preguntaId: number | null = null;

  private subscriptions = new Subscription();
  private baseUrl = API_CONFIG.baseUrl; 

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private consultaService: ConsultaService,
    public consultaState: ConsultaState,
    public respuestaState: RespuestaConsultaState,
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

    const consulta$ = this.consultaService.getById(id);
    const respuestas$ = this.consultaService.getRespuestas(id);
    
    const loadSub = forkJoin({
        consulta: consulta$,
        respuestas: respuestas$
    }).pipe(
        finalize(() => this._isLoading = false)
    ).subscribe({
        next: (results) => {
            this.consultaState.setConsultaActual(results.consulta);
            this.respuestaState.setRespuestas(results.respuestas);
        },
        error: (err) => {
            console.error(err);
            this.errorMensaje = "Error al cargar los datos.";
        }
    });
    
    this.subscriptions.add(loadSub);
  }

  // --- Actions ---
  // --- Actions ---
  // No actions available per user request

  // --- Template Helpers ---
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
}
