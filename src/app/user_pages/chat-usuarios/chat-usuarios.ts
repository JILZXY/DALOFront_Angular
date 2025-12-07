import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ChatState } from '../../state/chat.state';
import { Chat, Mensaje } from '../../models';

@Component({
  selector: 'app-chat-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-usuarios.html', // Fixed typo: templateUrl not template
  styleUrls: ['./chat-usuarios.css']
})
export class ChatUsuarios implements OnInit, OnDestroy {
  
  chats$!: Observable<Chat[]>;
  chatActual$!: Observable<Chat | null>;
  mensajes$!: Observable<Mensaje[]>;
  isLoading$!: Observable<boolean>;

  mensajeNuevo: string = '';
  terminoBusqueda: string = '';
  
  usuarioActualId: string | null = null; 

  private subscriptions = new Subscription();

  constructor(
    private chatState: ChatState,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.chats$ = this.chatState.chats$;
    this.chatActual$ = this.chatState.chatActual$;
    this.mensajes$ = this.chatState.mensajes$;
    this.isLoading$ = this.chatState.loading$;
  }

  ngOnInit(): void {
    // Try to get user ID from localStorage if available (common pattern)
    // or just rely on the API returning data where we can infer?
    // Usually 'usuario' obj in localStorage.
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
        const user = JSON.parse(userStr);
        this.usuarioActualId = user.idUsuario || user.id; 
    }

    this.chatState.loadMyChats();

    // Check for query params to start a chat
    this.route.queryParams.subscribe(params => {
      const abogadoId = params['abogadoId'];
      const nombreAbogado = params['nombre'];
      
      if (abogadoId) {
         // Wait for chats to load or try finding immediately if behavior subject has value
         // Better: Subscribe to chats once and check if target exists
         const existingChat = this.chatState.chats.find(c => 
             c.usuarioAbogadoId === abogadoId || c.abogado?.idAbogado === abogadoId
         );

         if (existingChat) {
             this.chatState.selectChat(existingChat.id);
         } else {
             // Create new chat
             // We need the 'usuarioAbogadoId'. If 'abogadoId' passed is the ABOGADO ID, we might need the USUARIO ID of that lawyer?
             // The model says 'usuarioAbogadoId'. 
             // In 'contactar-abogado.ts', it passed: abogadoId: abogado.idAbogado || abogado.idUsuario
             // If it passed idUsuario (string), we are good.
             this.chatState.createChat(abogadoId);
         }
         
         // Clear params
         this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
         });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    // Maybe clear state?
    // this.chatState.clear(); // Only if we want to reset on leave
  }

  seleccionarChat(chat: Chat): void {
    this.chatState.selectChat(chat.id);
  }

  enviarMensaje(): void {
    if (!this.mensajeNuevo.trim()) return;
    this.chatState.sendMessage(this.mensajeNuevo);
    this.mensajeNuevo = '';
  }

  // Helpers for template
  getNombreContacto(chat: Chat): string {
      // If I am the client, show the lawyer name
      // chat.abogado?.usuario?.nombre
      // If the chat data structure from 'getMyChats' is populated correctly.
      return chat.abogado?.usuario?.nombre || 'Abogado';
  }

    getRolContacto(chat: Chat): string {
        // e.g. 'Abogado Penal' (Especialidad)
        if (chat.abogado?.especialidades && chat.abogado.especialidades.length > 0) {
            return chat.abogado.especialidades[0].nombreMateria || 'Abogado';
        }
        return 'Abogado';
    }

  esEnviadoPorMi(mensaje: Mensaje): boolean {
      // Compare with stored ID. 
      // Note: Model has 'remitenteId' (string). 
      return mensaje.remitenteId === this.usuarioActualId; 
  }

  getHora(fecha: string): string {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Filter local logic
  getChatsFiltrados(chats: Chat[] | null): Chat[] {
      if (!chats) return [];
      if (!this.terminoBusqueda.trim()) return chats;
      
      const term = this.terminoBusqueda.toLowerCase();
      return chats.filter(c => 
          this.getNombreContacto(c).toLowerCase().includes(term)
      );
  }
}
