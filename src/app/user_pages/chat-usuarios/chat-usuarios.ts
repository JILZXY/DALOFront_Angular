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
  templateUrl: './chat-usuarios.html', 
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
    
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
        const user = JSON.parse(userStr);
        this.usuarioActualId = user.idUsuario || user.id; 
    }

    this.chatState.loadMyChats();

    this.route.queryParams.subscribe(params => {
      const abogadoId = params['abogadoId'];
      const nombreAbogado = params['nombre'];
      
      if (abogadoId) {
         
         const existingChat = this.chatState.chats.find(c => 
             c.usuarioAbogadoId === abogadoId || c.abogado?.idAbogado === abogadoId
         );

         if (existingChat) {
             this.chatState.selectChat(existingChat.id);
         } else {
        
             this.chatState.createChat(abogadoId);
         }
         
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
    
  }

  seleccionarChat(chat: Chat): void {
    this.chatState.selectChat(chat.id);
  }

  enviarMensaje(): void {
    if (!this.mensajeNuevo.trim()) return;
    this.chatState.sendMessage(this.mensajeNuevo);
    this.mensajeNuevo = '';
  }

  getNombreContacto(chat: Chat): string {
    
      return chat.abogado?.usuario?.nombre || 'Abogado';
  }

    getRolContacto(chat: Chat): string {
        if (chat.abogado?.especialidades && chat.abogado.especialidades.length > 0) {
            return chat.abogado.especialidades[0].nombreMateria || 'Abogado';
        }
        return 'Abogado';
    }

  esEnviadoPorMi(mensaje: Mensaje): boolean {
   
      return mensaje.remitenteId === this.usuarioActualId; 
  }

  getHora(fecha: string): string {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getChatsFiltrados(chats: Chat[] | null): Chat[] {
      if (!chats) return [];
      if (!this.terminoBusqueda.trim()) return chats;
      
      const term = this.terminoBusqueda.toLowerCase();
      return chats.filter(c => 
          this.getNombreContacto(c).toLowerCase().includes(term)
      );
  }
}
