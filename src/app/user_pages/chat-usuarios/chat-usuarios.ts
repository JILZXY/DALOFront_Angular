import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, of, catchError } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Mensaje {
  id: number;
  contenido: string;
  fecha: string;
  esEnviado: boolean; // true si es del usuario actual, false si es recibido
  idRemitente: number; // ID del usuario que envía el mensaje
  tipoRemitente: 'usuario' | 'abogado'; // Tipo de usuario que envía el mensaje
}

interface Contacto {
  id: number; // ID del contacto (idUsuario si es usuario, idAbogado si es abogado)
  nombre: string;
  rol: string; // Para usuarios: "Usuario", para abogados: especialidad
  tipoUsuario: 'usuario' | 'abogado'; // Identificador claro del tipo
  avatar?: string;
  ultimaFecha: string;
  mensajesNoLeidos: number;
  mensajes: Mensaje[];
}

@Component({
  selector: 'app-chat-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-usuarios.html',
  styleUrls: ['./chat-usuarios.css']
})
export class ChatUsuarios implements OnInit, OnDestroy {
  
  contactos: Contacto[] = [];
  contactoSeleccionado: Contacto | null = null;
  mensajeNuevo: string = '';
  terminoBusqueda: string = '';
  
  usuarioActual = {
    id: 1, // ID del usuario actual (se obtendrá de la sesión/API)
    nombre: 'Usuario Actual',
    tipo: 'Usuario',
    tipoUsuario: 'usuario' as const // Identificador claro para la API
  };

  isLoading: boolean = false;
  errorMensaje: string | null = null;

  private subscriptions = new Subscription();
  private baseUrl = 'http://52.3.15.55:7000';
  
  // Endpoints de la API (ajustar según la estructura real de tu API)
  private get contactosUrl(): string {
    return `${this.baseUrl}/usuarios/${this.usuarioActual.id}/chat/contactos`;
  }
  
  private getMensajesUrl(contactoId: number): string {
    return `${this.baseUrl}/usuarios/${this.usuarioActual.id}/chat/${contactoId}/mensajes`;
  }
  
  private get enviarMensajeUrl(): string {
    return `${this.baseUrl}/usuarios/${this.usuarioActual.id}/chat/mensajes`;
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Leer parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      const abogadoId = params['abogadoId'];
      const nombreAbogado = params['nombre'];
      
      if (abogadoId && nombreAbogado) {
        // Cargar contactos y luego seleccionar el abogado
        this.cargarContactos(parseInt(abogadoId), nombreAbogado);
      } else {
        this.cargarContactos();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarContactos(abogadoIdBuscado?: number, nombreAbogado?: string): void {
    this.isLoading = true;
    this.errorMensaje = null;

    // Llamada HTTP real a la API
    const sub = this.http.get<Contacto[]>(this.contactosUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar contactos desde API, usando datos simulados:', error);
          // Fallback a datos simulados si la API falla
          return this.getDatosSimulados();
        })
      )
      .subscribe({
        next: (data) => {
          this.contactos = data;
          this.procesarContactosCargados(abogadoIdBuscado, nombreAbogado);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar contactos:', error);
          this.errorMensaje = 'Error al cargar los contactos. Intenta más tarde.';
          this.isLoading = false;
        }
      });

    this.subscriptions.add(sub);
  }

  private getDatosSimulados() {
    // Datos simulados como fallback
    const datosSimulados: Contacto[] = [
      {
        id: 201, // idAbogado
        nombre: 'GABRIEL MÁRQUEZ',
        rol: 'Abogado Penal',
        tipoUsuario: 'abogado',
        ultimaFecha: 'AYER',
        mensajesNoLeidos: 1,
        mensajes: [
          { id: 1, contenido: 'Hola, ¿cómo puedo ayudarte?', fecha: '11:40am', esEnviado: false, idRemitente: 201, tipoRemitente: 'abogado' },
          { id: 2, contenido: 'Tengo una consulta sobre mi caso', fecha: '11:41am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'usuario' },
          { id: 3, contenido: 'Claro, cuéntame más detalles', fecha: '11:42am', esEnviado: false, idRemitente: 201, tipoRemitente: 'abogado' },
          { id: 4, contenido: 'Necesito asesoría urgente', fecha: '11:43am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'usuario' },
          { id: 5, contenido: 'Perfecto, podemos agendar una cita', fecha: '11:44am', esEnviado: false, idRemitente: 201, tipoRemitente: 'abogado' },
          { id: 6, contenido: '¿Qué días tienes disponible?', fecha: '11:45am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'usuario' },
          { id: 7, contenido: 'Puedo el lunes o miércoles', fecha: '11:46am', esEnviado: false, idRemitente: 201, tipoRemitente: 'abogado' }
        ]
      },
      {
        id: 202, // idAbogado
        nombre: 'ALEJANDRO GARCIA',
        rol: 'Abogado Penal',
        tipoUsuario: 'abogado',
        ultimaFecha: 'Hace 2 días',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'Buenos días', fecha: '10:30am', esEnviado: false, idRemitente: 202, tipoRemitente: 'abogado' },
          { id: 2, contenido: 'Buenos días, ¿en qué puedo ayudarte?', fecha: '10:31am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'usuario' }
        ]
      },
      {
        id: 203, // idAbogado
        nombre: 'MARCOS FIGUEROA',
        rol: 'Abogado Penal',
        tipoUsuario: 'abogado',
        ultimaFecha: 'Hace 3 días',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'Gracias por tu ayuda', fecha: '09:15am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'usuario' },
          { id: 2, contenido: 'De nada, cualquier duda aquí estoy', fecha: '09:16am', esEnviado: false, idRemitente: 203, tipoRemitente: 'abogado' }
        ]
      },
      {
        id: 204, // idAbogado
        nombre: 'FABIAN PEREZ',
        rol: 'Abogado Penal',
        tipoUsuario: 'abogado',
        ultimaFecha: 'Hace 5 días',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'Hola', fecha: '14:20pm', esEnviado: false, idRemitente: 204, tipoRemitente: 'abogado' }
        ]
      },
      {
        id: 205, // idAbogado
        nombre: 'ESTEBAN GUTIERREZ',
        rol: 'Abogado Penal',
        tipoUsuario: 'abogado',
        ultimaFecha: 'Hace 1 semana',
        mensajesNoLeidos: 1,
        mensajes: [
          { id: 1, contenido: 'Necesito información', fecha: '16:45pm', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'usuario' }
        ]
      },
      {
        id: 206, // idAbogado
        nombre: 'ESTHER GUZMAN',
        rol: 'Abogado Penal',
        tipoUsuario: 'abogado',
        ultimaFecha: 'Hace 2 semanas',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'Consulta sobre documentos', fecha: '11:00am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'usuario' },
          { id: 2, contenido: 'Te puedo ayudar con eso', fecha: '11:05am', esEnviado: false, idRemitente: 206, tipoRemitente: 'abogado' }
        ]
      }
    ];

    return of(datosSimulados).pipe(delay(500));
  }

  private procesarContactosCargados(abogadoIdBuscado?: number, nombreAbogado?: string): void {
    // Si se busca un abogado específico
    if (abogadoIdBuscado && nombreAbogado) {
      // Buscar si el contacto ya existe
      const contactoExistente = this.contactos.find(c => c.id === abogadoIdBuscado);
      
      if (contactoExistente) {
        // Si existe, seleccionarlo y cargar sus mensajes
        this.seleccionarContacto(contactoExistente);
        this.cargarMensajesContacto(contactoExistente.id);
      } else {
        // Si no existe, crear un nuevo contacto vacío
        const nuevoContacto: Contacto = {
          id: abogadoIdBuscado,
          nombre: nombreAbogado.toUpperCase(),
          rol: 'Abogado',
          tipoUsuario: 'abogado',
          ultimaFecha: 'Ahora',
          mensajesNoLeidos: 0,
          mensajes: []
        };
        
        // Agregar al inicio de la lista
        this.contactos.unshift(nuevoContacto);
        this.seleccionarContacto(nuevoContacto);
      }
      
      // Limpiar los query params después de usarlos
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    } else {
      // Si no hay búsqueda específica, seleccionar el primero por defecto
      if (this.contactos.length > 0 && !this.contactoSeleccionado) {
        const primerContacto = this.contactos[0];
        this.seleccionarContacto(primerContacto);
        this.cargarMensajesContacto(primerContacto.id);
      }
    }
  }

  cargarMensajesContacto(contactoId: number): void {
    if (!this.contactoSeleccionado || this.contactoSeleccionado.id !== contactoId) {
      return;
    }

    const sub = this.http.get<Mensaje[]>(this.getMensajesUrl(contactoId))
      .pipe(
        catchError(error => {
          console.error('Error al cargar mensajes desde API:', error);
          return of([]); // Retornar array vacío si falla
        })
      )
      .subscribe({
        next: (mensajes) => {
          if (this.contactoSeleccionado) {
            // Mapear mensajes de la API al formato local
            this.contactoSeleccionado.mensajes = mensajes.map(msg => ({
              ...msg,
              esEnviado: msg.idRemitente === this.usuarioActual.id && msg.tipoRemitente === 'usuario'
            }));
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error al cargar mensajes:', error);
        }
      });

    this.subscriptions.add(sub);
  }

  seleccionarContacto(contacto: Contacto): void {
    this.contactoSeleccionado = contacto;
    contacto.mensajesNoLeidos = 0; // Marcar como leídos
    
    // Cargar mensajes del contacto seleccionado
    this.cargarMensajesContacto(contacto.id);
    
    // Marcar mensajes como leídos en la API
    this.marcarMensajesLeidos(contacto.id);
  }

  marcarMensajesLeidos(contactoId: number): void {
    const url = `${this.baseUrl}/usuarios/${this.usuarioActual.id}/chat/${contactoId}/marcar-leidos`;
    this.http.post(url, {}).pipe(
      catchError(error => {
        console.error('Error al marcar mensajes como leídos:', error);
        return of(null);
      })
    ).subscribe();
  }

  enviarMensaje(): void {
    if (!this.mensajeNuevo.trim() || !this.contactoSeleccionado) {
      return;
    }

    const contenido = this.mensajeNuevo.trim();
    this.mensajeNuevo = ''; // Limpiar input inmediatamente para mejor UX

    // Payload para la API
    const payload = {
      idDestinatario: this.contactoSeleccionado.id,
      tipoDestinatario: this.contactoSeleccionado.tipoUsuario,
      contenido: contenido,
      idRemitente: this.usuarioActual.id,
      tipoRemitente: 'usuario'
    };

    // Enviar mensaje a la API
    const sub = this.http.post<Mensaje>(this.enviarMensajeUrl, payload)
      .pipe(
        catchError(error => {
          console.error('Error al enviar mensaje a la API:', error);
          // Crear mensaje localmente si la API falla
          return of({
            id: Date.now(),
            contenido: contenido,
            fecha: this.obtenerHoraActual(),
            esEnviado: true,
            idRemitente: this.usuarioActual.id,
            tipoRemitente: 'usuario' as const
          });
        })
      )
      .subscribe({
        next: (mensajeEnviado) => {
          if (this.contactoSeleccionado) {
            // Mapear respuesta de la API al formato local
            const nuevoMensaje: Mensaje = {
              ...mensajeEnviado,
              tipoRemitente: mensajeEnviado.tipoRemitente as 'usuario' | 'abogado',
              esEnviado: mensajeEnviado.idRemitente === this.usuarioActual.id && 
                        mensajeEnviado.tipoRemitente === 'usuario'
            };
            
            this.contactoSeleccionado.mensajes.push(nuevoMensaje);
            this.contactoSeleccionado.ultimaFecha = 'Ahora';
            
            // Forzar detección de cambios
            this.cdr.detectChanges();
            
            // Scroll al final del chat
            setTimeout(() => {
              const chatContainer = document.querySelector('.chat-messages');
              if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
              }
            }, 100);
          }
        },
        error: (error) => {
          console.error('Error al enviar mensaje:', error);
          // Mostrar mensaje de error al usuario
          this.errorMensaje = 'Error al enviar el mensaje. Intenta nuevamente.';
          setTimeout(() => {
            this.errorMensaje = null;
          }, 3000);
        }
      });

    this.subscriptions.add(sub);
  }

  obtenerHoraActual(): string {
    const ahora = new Date();
    const horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const ampm = horas >= 12 ? 'pm' : 'am';
    const horas12 = horas % 12 || 12;
    return `${horas12}:${minutos.toString().padStart(2, '0')}${ampm}`;
  }

  getContactosFiltrados(): Contacto[] {
    if (!this.terminoBusqueda.trim()) {
      return this.contactos;
    }
    const termino = this.terminoBusqueda.toLowerCase();
    return this.contactos.filter(contacto => 
      contacto.nombre.toLowerCase().includes(termino) ||
      contacto.rol.toLowerCase().includes(termino)
    );
  }
}

