import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Usuario } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    
    getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(
            `${this.baseUrl}/api/usuarios`
        );
    }


    getCurrentUser(): Observable<Usuario> {
        return this.http.get<Usuario>(
            `${this.baseUrl}${API_CONFIG.endpoints.me}`
        );
    }

    
    getById(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(
            `${this.baseUrl}/api/usuarios/${id}`
        );
    }

    
    update(id: string, data: Partial<Usuario>): Observable<Usuario> {
        return this.http.put<Usuario>(
            `${this.baseUrl}/api/usuarios/${id}`,
            data
        );
    }

    
    delete(id: string): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/api/usuarios/${id}`
        );
    }
}