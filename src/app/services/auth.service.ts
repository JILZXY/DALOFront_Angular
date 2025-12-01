import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { LoginRequest, RegisterRequest, RegisterAbogadoRequest, AuthResponse, Usuario } from '../models';
import { AuthState } from '../state/auth.state';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(
        private http: HttpClient,
        private authState: AuthState,
        private router: Router
    ) { }


    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.baseUrl}${API_CONFIG.endpoints.login}`,
            credentials
        );
    }


    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.baseUrl}${API_CONFIG.endpoints.register}`,
            data
        );
    }

    registerAbogado(data: RegisterAbogadoRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.baseUrl}${API_CONFIG.endpoints.registerAbogado}`,
            data
        );
    }


    getCurrentUser(): Observable<Usuario> {
        return this.http.get<Usuario>(
            `${this.baseUrl}${API_CONFIG.endpoints.me}`
        );
    }


    getUserByEmail(email: string): Observable<Usuario> {
        return this.http.get<Usuario>(
            `${this.baseUrl}/api/auth/email/${email}`
        );
    }


    getUsuariosInactivos(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(
            `${this.baseUrl}/api/auth/inactivos`
        );
    }


    activarUsuario(id: string): Observable<void> {
        return this.http.patch<void>(
            `${this.baseUrl}/api/auth/${id}/activar`,
            {}
        );
    }


    getAllUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(
            `${this.baseUrl}/api/usuarios`
        );
    }


    getUsuarioById(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(
            `${this.baseUrl}/api/usuarios/${id}`
        );
    }


    updateUsuario(id: string, data: Partial<Usuario>): Observable<Usuario> {
        return this.http.put<Usuario>(
            `${this.baseUrl}/api/usuarios/${id}`,
            data
        );
    }


    deleteUsuario(id: string): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/api/usuarios/${id}`
        );
    }

    logout(): void {
        this.authState.clearAuth();

        this.router.navigate(['/login']);
    }
}