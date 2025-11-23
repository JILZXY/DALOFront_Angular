import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
    Chat,
    CreateChatRequest,
    Mensaje,
    SendMensajeRequest
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    getMyChats(): Observable<Chat[]> {
        return this.http.get<Chat[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.chats}`
        );
    }

    getById(id: number): Observable<Chat> {
        return this.http.get<Chat>(
            `${this.baseUrl}${API_CONFIG.endpoints.chats}/${id}`
        );
    }

    create(data: CreateChatRequest): Observable<Chat> {
        return this.http.post<Chat>(
            `${this.baseUrl}${API_CONFIG.endpoints.chats}`,
            data
        );
    }


    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.chats}/${id}`
        );
    }


    getMensajes(chatId: number): Observable<Mensaje[]> {
        return this.http.get<Mensaje[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.mensajes}/${chatId}/mensajes`
        );
    }


    sendMensaje(chatId: number, data: SendMensajeRequest): Observable<Mensaje> {
        return this.http.post<Mensaje>(
            `${this.baseUrl}${API_CONFIG.endpoints.mensajes}/${chatId}/mensajes`,
            data
        );
    }

    deleteMensaje(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/api/mensajes/${id}`
        );
    }
}