import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-chat-abogado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-abogado.html',
  styleUrls: ['./chat-abogado.css']
})
export class ChatAbogado implements OnInit, OnDestroy {
  
  contactos: Contacto[] = [];
  contactoSeleccionado: Contacto | null = null;
  mensajeNuevo: string = '';
  terminoBusqueda: string = '';
  
  usuarioActual = {
    id: 1, // ID del abogado actual (se obtendrá de la sesión/API)
    nombre: 'Gilberto Malaga Fernandez',
    tipo: 'Abogado',
    tipoUsuario: 'abogado' as const // Identificador claro para la API
  };

  isLoading: boolean = false;
  errorMensaje: string | null = null;

  private subscriptions = new Subscription();
  private baseUrl = 'http://52.3.15.55:7000';
  
  // Endpoints de la API (ajustar según la estructura real de tu API)
  private get contactosUrl(): string {
    return `${this.baseUrl}/abogados/${this.usuarioActual.id}/chat/contactos`;
  }
  
  private getMensajesUrl(contactoId: number): string {
    return `${this.baseUrl}/abogados/${this.usuarioActual.id}/chat/${contactoId}/mensajes`;
  }
  
  private get enviarMensajeUrl(): string {
    return `${this.baseUrl}/abogados/${this.usuarioActual.id}/chat/mensajes`;
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarContactos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarContactos(): void {
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
          if (data.length > 0 && !this.contactoSeleccionado) {
            const primerContacto = data[0];
            this.seleccionarContacto(primerContacto);
            this.cargarMensajesContacto(primerContacto.id);
          }
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
        id: 101, // idUsuario - Este usuario chatea con el abogado GABRIEL MÁRQUEZ (id 201)
        nombre: 'USUARIO GABRIEL',
        rol: 'Usuario',
        tipoUsuario: 'usuario',
        ultimaFecha: 'AYER',
        mensajesNoLeidos: 1,
        mensajes: [
          { id: 1, contenido: 'Tengo una consulta sobre mi caso', fecha: '11:41am', esEnviado: false, idRemitente: 101, tipoRemitente: 'usuario' },
          { id: 2, contenido: 'Hola, claro, ¿en qué puedo ayudarte?', fecha: '11:40am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'abogado' },
          { id: 3, contenido: 'Necesito asesoría urgente', fecha: '11:43am', esEnviado: false, idRemitente: 101, tipoRemitente: 'usuario' },
          { id: 4, contenido: 'Perfecto, podemos agendar una cita', fecha: '11:44am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'abogado' },
          { id: 5, contenido: '¿Qué días tienes disponible?', fecha: '11:45am', esEnviado: false, idRemitente: 101, tipoRemitente: 'usuario' },
          { id: 6, contenido: 'Puedo el lunes o miércoles', fecha: '11:46am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'abogado' }
        ]
      },
      {
        id: 102, // idUsuario - Este usuario chatea con el abogado ALEJANDRO GARCIA (id 202)
        nombre: 'USUARIO ALEJANDRO',
        rol: 'Usuario',
        tipoUsuario: 'usuario',
        ultimaFecha: 'Hace 2 días',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'Buenos días, ¿en qué puedo ayudarte?', fecha: '10:31am', esEnviado: false, idRemitente: 102, tipoRemitente: 'usuario' },
          { id: 2, contenido: 'Buenos días', fecha: '10:30am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'abogado' }
        ]
      },
      {
        id: 103, // idUsuario - Este usuario chatea con el abogado MARCOS FIGUEROA (id 203)
        nombre: 'USUARIO MARCOS',
        rol: 'Usuario',
        tipoUsuario: 'usuario',
        ultimaFecha: 'Hace 3 días',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'De nada, cualquier duda aquí estoy', fecha: '09:16am', esEnviado: false, idRemitente: 103, tipoRemitente: 'usuario' },
          { id: 2, contenido: 'Gracias por tu ayuda', fecha: '09:15am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'abogado' }
        ]
      },
      {
        id: 104, // idUsuario - Este usuario chatea con el abogado FABIAN PEREZ (id 204)
        nombre: 'USUARIO FABIAN',
        rol: 'Usuario',
        tipoUsuario: 'usuario',
        ultimaFecha: 'Hace 5 días',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'Hola', fecha: '14:20pm', esEnviado: false, idRemitente: 104, tipoRemitente: 'usuario' }
        ]
      },
      {
        id: 105, // idUsuario - Este usuario chatea con el abogado ESTEBAN GUTIERREZ (id 205)
        nombre: 'USUARIO ESTEBAN',
        rol: 'Usuario',
        tipoUsuario: 'usuario',
        ultimaFecha: 'Hace 1 semana',
        mensajesNoLeidos: 1,
        mensajes: [
          { id: 1, contenido: 'Necesito información', fecha: '16:45pm', esEnviado: false, idRemitente: 105, tipoRemitente: 'usuario' }
        ]
      },
      {
        id: 106, // idUsuario - Este usuario chatea con el abogado ESTHER GUZMAN (id 206)
        nombre: 'USUARIO ESTHER',
        rol: 'Usuario',
        tipoUsuario: 'usuario',
        ultimaFecha: 'Hace 2 semanas',
        mensajesNoLeidos: 0,
        mensajes: [
          { id: 1, contenido: 'Te puedo ayudar con eso', fecha: '11:05am', esEnviado: false, idRemitente: 106, tipoRemitente: 'usuario' },
          { id: 2, contenido: 'Consulta sobre documentos', fecha: '11:00am', esEnviado: true, idRemitente: this.usuarioActual.id, tipoRemitente: 'abogado' }
        ]
      }
    ];

    return of(datosSimulados).pipe(delay(500));
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
              esEnviado: msg.idRemitente === this.usuarioActual.id && msg.tipoRemitente === 'abogado'
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
    const url = `${this.baseUrl}/abogados/${this.usuarioActual.id}/chat/${contactoId}/marcar-leidos`;
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
      tipoRemitente: 'abogado'
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
            tipoRemitente: 'abogado' as const
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
                        mensajeEnviado.tipoRemitente === 'abogado'
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

