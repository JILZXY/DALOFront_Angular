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

    /**
     * Obtener todos los usuarios
     * GET /api/usuarios
     */
    getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(
            `${this.baseUrl}/api/usuarios`
        );
    }

    /**
     * Obtener usuario actual autenticado
     * GET /api/usuarios/me
     */
    getCurrentUser(): Observable<Usuario> {
        return this.http.get<Usuario>(
            `${this.baseUrl}${API_CONFIG.endpoints.me}`
        );
    }

    /**
     * Obtener usuario por ID
     * GET /api/usuarios/{id}
     */
    getById(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(
            `${this.baseUrl}/api/usuarios/${id}`
        );
    }

    /**
     * Actualizar usuario
     * PUT /api/usuarios/{id}
     */
    update(id: string, data: Partial<Usuario>): Observable<Usuario> {
        return this.http.put<Usuario>(
            `${this.baseUrl}/api/usuarios/${id}`,
            data
        );
    }

    /**
     * Eliminar usuario
     * DELETE /api/usuarios/{id}
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/api/usuarios/${id}`
        );
    }
}