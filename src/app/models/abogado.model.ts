import { Usuario } from './usuario.model';
import { Especialidad } from './shared.model';

export interface Abogado {
    idAbogado?: string; 
    idUsuario?: string; 
    cedulaProfesional: string | null;
    biografia: string | null;
    descripcion?: string;
    calificacionPromedio?: number;
    usuario?: Usuario;
    especialidades?: Especialidad[];
}