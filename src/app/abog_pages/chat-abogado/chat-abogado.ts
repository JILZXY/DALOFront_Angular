import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { ChatState } from '../../state/chat.state';
import { Chat, Mensaje } from '../../models';

@Component({
  selector: 'app-chat-abogado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-abogado.html',
  styleUrls: ['./chat-abogado.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatAbogado implements OnInit, OnDestroy {
  
  chats$!: Observable<Chat[]>;
  chatActual$!: Observable<Chat | null>;
  mensajes$!: Observable<Mensaje[]>;
  isLoading$!: Observable<boolean>;

  mensajeNuevo: string = '';
  terminoBusqueda: string = '';
  
  usuarioActual: any = { nombre: 'Abogado', tipo: 'Abogado' }; 
  usuarioActualId: string | null = null; 

  private subscriptions = new Subscription();

  constructor(
    private chatState: ChatState,
    private cdr: ChangeDetectorRef
  ) {
    this.chats$ = this.chatState.chats$;
    this.chatActual$ = this.chatState.chatActual$;
    this.mensajes$ = this.chatState.mensajes$;
    this.isLoading$ = this.chatState.loading$;
  }

  ngOnInit(): void {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
        this.usuarioActual = JSON.parse(userStr);
        this.usuarioActualId = this.usuarioActual.idUsuario || this.usuarioActual.id; 
    }

    this.chatState.loadMyChats();
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
      return chat.cliente?.nombre || 'Cliente';
  }

  getRolContacto(chat: Chat): string {
      return 'Cliente';
  }

  getHora(fecha: string): string {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  esEnviadoPorMi(mensaje: Mensaje): boolean {
       return mensaje.remitenteId == this.usuarioActualId;
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
