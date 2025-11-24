import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat, Mensaje } from '../models';

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


    addChat(chat: Chat): void {
        const actuales = this.chatsSubject.value;
        this.chatsSubject.next([chat, ...actuales]);
    }

    addMensaje(mensaje: Mensaje): void {
        const actuales = this.mensajesSubject.value;
        this.mensajesSubject.next([...actuales, mensaje]);

        if (this.chatActual && this.chatActual.id === mensaje.chatId) {
            const chatActualizado = {
                ...this.chatActual,
                ultimoMensaje: mensaje
            };
            this.chatActualSubject.next(chatActualizado);

            const chats = this.chatsSubject.value.map(c =>
                c.id === mensaje.chatId ? chatActualizado : c
            );
            this.chatsSubject.next(chats);
        }
    }

    deleteChat(chatId: number): void {
        const chats = this.chatsSubject.value.filter(c => c.id !== chatId);
        this.chatsSubject.next(chats);

        if (this.chatActual?.id === chatId) {
            this.chatActualSubject.next(null);
            this.mensajesSubject.next([]);
        }
    }

    deleteMensaje(mensajeId: number): void {
        const mensajes = this.mensajesSubject.value.filter(m => m.id !== mensajeId);
        this.mensajesSubject.next(mensajes);
    }

    findChatById(id: number): Chat | undefined {
        return this.chats.find(c => c.id === id);
    }

    getUnreadCount(): number {
        return 0;
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