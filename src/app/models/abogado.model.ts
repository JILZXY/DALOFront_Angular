import { Usuario } from './usuario.model';
import { Especialidad } from './shared.model';

export interface Abogado {
    idUsuario: string;
    cedulaProfesional: string | null;
    biografia: string | null;
    calificacionPromedio: number;
    usuario?: Usuario;
    especialidades: Especialidad[];
}