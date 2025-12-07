import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat, Mensaje } from '../models';
import { ChatService } from '../services/chat.service';

@Injectable({
    providedIn: 'root'
})
export class ChatState {
    private chatsSubject = new BehaviorSubject<Chat[]>([]);
    public chats$: Observable<Chat[]> = this.chatsSubject.asObservable();

    private chatActualSubject = new BehaviorSubject<Chat | null>(null);
    public chatActual$: Observable<Chat | null> = this.chatActualSubject.asObservable();

    private mensajesSubject = new BehaviorSubject<Mensaje[]>([]);
    public mensajes$: Observable<Mensaje[]> = this.mensajesSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor(private chatService: ChatService) {}

    get chats(): Chat[] {
        return this.chatsSubject.value;
    }

    get chatActual(): Chat | null {
        return this.chatActualSubject.value;
    }

    get mensajes(): Mensaje[] {
        return this.mensajesSubject.value;
    }

    setChats(chats: Chat[]): void {
        this.chatsSubject.next(chats);
    }

    setChatActual(chat: Chat | null): void {
        this.chatActualSubject.next(chat);
    }

    setMensajes(mensajes: Mensaje[]): void {
        this.mensajesSubject.next(mensajes);
    }

    // --- Actions ---

    loadMyChats(): void {
        this.setLoading(true);
        this.chatService.getMyChats().subscribe({
            next: (data) => {
                this.setChats(data);
                this.setLoading(false);
            },
            error: (err) => {
                console.error('Error loading chats', err);
                this.setLoading(false);
            }
        });
    }

    createChat(usuarioAbogadoId: string): void {
        this.setLoading(true);
        this.chatService.create({ usuarioAbogadoId }).subscribe({
            next: (newChat) => {
                this.addChat(newChat);
                this.selectChat(newChat.id);
                this.setLoading(false);
            },
            error: (err) => {
                console.error('Error creating chat', err);
                this.setLoading(false);
            }
        });
    }

    selectChat(chatId: number): void {
        const chat = this.findChatById(chatId);
        if (chat) {
            this.setChatActual(chat);
            this.setMensajes([]); // Clear messages to avoid stale data
            this.loadMensajes(chatId);
        }
    }

    loadMensajes(chatId: number): void {
        this.chatService.getMensajes(chatId).subscribe({
            next: (data) => {
                this.setMensajes(data);
            },
            error: (err) => {
                console.error('Error loading messages', err);
                this.setMensajes([]); // Ensure empty on error
            }
        });
    }

    sendMessage(contenido: string): void {
        const currentChat = this.chatActual;
        if (!currentChat) return;

        this.chatService.sendMensaje(currentChat.id, { mensaje: contenido }).subscribe({
            next: (msg) => {
                this.addMensaje(msg);
            },
            error: (err) => {
                console.error('Error sending message', err);
            }
        });
    }

    // --- Internal State Helpers ---

    addChat(chat: Chat): void {
        const actuales = this.chatsSubject.value;
        // Check if exists to avoid dupes
        if (!actuales.find(c => c.id === chat.id)) {
             this.chatsSubject.next([chat, ...actuales]);
        }
    }

    addMensaje(mensaje: Mensaje): void {
        const actuales = this.mensajesSubject.value;
        this.mensajesSubject.next([...actuales, mensaje]);

        // Update last message in chat list
        if (this.chatActual && this.chatActual.id === mensaje.chatId) {
            // Update local object
            const chatActualizado = { ...this.chatActual, ultimoMensaje: mensaje };
            this.chatActualSubject.next(chatActualizado);
            this.updateChatInList(chatActualizado);
        } else {
             // If message received for another chat (e.g. websocket in future), find and update
             const chat = this.findChatById(mensaje.chatId);
             if (chat) {
                 this.updateChatInList({ ...chat, ultimoMensaje: mensaje });
             }
        }
    }
    
    updateChatInList(updatedChat: Chat): void {
        const chats = this.chatsSubject.value.map(c => 
            c.id === updatedChat.id ? updatedChat : c
        );
        this.chatsSubject.next(chats);
    }

    deleteChat(chatId: number): void {
        this.chatService.delete(chatId).subscribe(() => {
             const chats = this.chatsSubject.value.filter(c => c.id !== chatId);
             this.chatsSubject.next(chats);

             if (this.chatActual?.id === chatId) {
                 this.chatActualSubject.next(null);
                 this.mensajesSubject.next([]);
             }
        });
    }

    deleteMensaje(mensajeId: number): void {
        const mensajes = this.mensajesSubject.value.filter(m => m.id !== mensajeId);
        this.mensajesSubject.next(mensajes);
    }

    findChatById(id: number): Chat | undefined {
        return this.chats.find(c => c.id === id);
    }

    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    clear(): void {
        this.chatsSubject.next([]);
        this.chatActualSubject.next(null);
        this.mensajesSubject.next([]);
        this.loadingSubject.next(false);
    }
}