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

export interface RegisterAbogadoRequest {
    nombre: string;
    email: string;
    contrasena: string;
    municipioId: number | null;
    cedulaProfesional: string;
    biografia: string | null;
    especialidadesIds: number[];
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}