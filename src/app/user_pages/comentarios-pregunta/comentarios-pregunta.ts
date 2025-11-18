// File: src/app/user_pages/comentarios-pregunta/comentarios-pregunta.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Importar Location
import { RouterModule, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

// --- Interfaces (basadas en tu .js) ---
interface Usuario {
  id: number;
  nombre: string;
}

interface Pregunta {
  idConsulta: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  idMateria: number;
  idUsuario: number;
  materia: { nombre: string; logo: string; };
  usuario: { nombre: string; };
  mejorRespuestaId: number | null;
}

interface Respuesta {
  idRespuesta: number;
  contenido: string;
  fecha: string;
  esMejorRespuesta: boolean;
  calificacionPromedio: number;
  abogado: { nombre: string; apellidos: string; foto: string; };
  // Propiedades que añadiremos dinámicamente
  yaCalificada?: boolean;
}

interface Calificacion {
  idCalificacion: number;
  idUsuarioCliente: number;
  idRespuesta: number;
}

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

  // --- Estado de la Vista ---
  pregunta: Pregunta | null = null;
  respuestas: Respuesta[] = [];
  isLoading: boolean = true;
  errorMensaje: string | null = null;
  private currentUser: Usuario | null = null;
  private preguntaId: string | null = null;

  // --- Estado del Modal ---
  isModalVisible: boolean = false;
  respuestaParaCalificar: Respuesta | null = null;
  calificacionData = {
    claridad: '',
    tiempo: '',
    empatia: ''
  };
  errorModal: string | null = null;

  private subscriptions = new Subscription();
  private apiUrl = 'http://52.3.15.55:7000'; // URL base de tu API

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location // Servicio para el botón "Volver"
  ) {}

  ngOnInit(): void {
    // 1. Obtener usuario de localStorage
    try {
      this.currentUser = JSON.parse(localStorage.getItem('usuario') || 'null');
    } catch (e) { console.error('Error al parsear usuario', e); }

    // 2. Obtener ID de la pregunta de la URL
    const routeSub = this.route.queryParamMap.subscribe(params => {
      // Usamos 'id' (el queryParam que definimos en 'mis-preguntas.ts')
      const id = params.get('id'); 
      if (id) {
        this.preguntaId = id;
        this.cargarDatosCompletos(id);
      } else {
        this.errorMensaje = "No se proporcionó un ID de pregunta.";
        this.isLoading = false;
      }
    });
    this.subscriptions.add(routeSub);
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones
    this.subscriptions.unsubscribe();
  }

  /**
   * Carga toda la información de la página en paralelo
   */
  cargarDatosCompletos(idPregunta: string): void {
    this.isLoading = true;
    this.errorMensaje = null;
    const usuarioId = this.currentUser?.id;

    // 3. Peticiones en paralelo con forkJoin
    const pregunta$ = this.http.get<Pregunta>(`${this.apiUrl}/consultas/${idPregunta}`);
    const respuestas$ = this.http.get<Respuesta[]>(`${this.apiUrl}/respuestas/consulta/${idPregunta}`);
    // Solo pedir calificaciones si hay un usuario logueado
    const calificaciones$ = usuarioId
      ? this.http.get<Calificacion[]>(`${this.apiUrl}/calificaciones/usuario/${usuarioId}`)
      : this.http.get<Calificacion[]>(`${this.apiUrl}/calificaciones`); // Fallback

    const loadSub = forkJoin({
      pregunta: pregunta$,
      respuestas: respuestas$,
      calificaciones: calificaciones$
    })
    .pipe(
      tap(({ pregunta, respuestas, calificaciones }) => {
        // 4. Procesar datos
        this.pregunta = pregunta;
        
        // Marcar respuestas ya calificadas
        const calificacionesHechas = new Set(calificaciones.map(c => c.idRespuesta));
        this.respuestas = respuestas.map(r => ({
          ...r,
          yaCalificada: calificacionesHechas.has(r.idRespuesta)
        }));
      }),
      catchError((err: HttpErrorResponse) => {
        // --- INICIO DE LA CORRECCIÓN ---
        // 1. Define el mensaje de error en una variable local (que es string)
        const errorMsg = "Error al cargar los datos. Inténtalo de nuevo.";
            
        // 2. Asigna el string a la propiedad de la clase
        this.errorMensaje = errorMsg; 
            
        console.error(err);
            
        // 3. Pasa la variable local (string) a throwError
        return throwError(() => new Error(errorMsg)); 
        // --- FIN DE LA CORRECCIÓN ---
      }),
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe();

    this.subscriptions.add(loadSub);
  }

  // --- Métodos del Modal ---
  abrirModalCalificacion(respuesta: Respuesta): void {
    if (respuesta.yaCalificada) return; // No abrir si ya está calificada
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
      idUsuarioCliente: this.currentUser.id,
      idRespuesta: this.respuestaParaCalificar.idRespuesta,
      claridad: parseInt(this.calificacionData.claridad),
      tiempoRespuesta: parseInt(this.calificacionData.tiempo),
      empatia: parseInt(this.calificacionData.empatia)
    };
    
    const califSub = this.http.post(`${this.apiUrl}/calificaciones`, body)
      .pipe(
        tap(() => {
          // Éxito: cerrar modal y recargar datos
          this.cerrarModalCalificacion();
          if (this.preguntaId) {
            this.cargarDatosCompletos(this.preguntaId); // Recargar para actualizar estado
          }
        }),
        catchError((err) => {
          this.errorModal = "Hubo un error al enviar la calificación.";
          console.error(err);
          return throwError(() => new Error(this.errorModal!));
        })
      )
      .subscribe();
      
    this.subscriptions.add(califSub);
  }

  // --- Métodos de Acciones ---
  marcarComoMejorRespuesta(idRespuesta: number): void {
    if (this.pregunta?.mejorRespuestaId) return; // No permitir si ya hay una

    const mejorSub = this.http.put(`${this.apiUrl}/respuestas/mejor/${idRespuesta}`, {})
      .pipe(
        tap(() => {
          // Éxito: recargar los datos
          if (this.preguntaId) {
            this.cargarDatosCompletos(this.preguntaId);
          }
        }),
        catchError((err) => {
          this.errorMensaje = "Error al marcar la respuesta.";
          console.error(err);
          return throwError(() => new Error(this.errorMensaje!));
        })
      )
      .subscribe();
      
    this.subscriptions.add(mejorSub);
  }

  // --- Métodos de Utilidad para el Template ---
  
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
}