import { Usuario } from './usuario.model';

export interface LoginRequest {
    email: string;
    contrasena: string;
}

export interface RegisterRequest {
    nombre: string;
    email: string;
    contrasena: string;
    municipioId: number | null;
    rolId: number;
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}