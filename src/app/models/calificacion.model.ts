import { Usuario } from './usuario.model';
import { Abogado } from './abogado.model';

export interface Calificacion {
    idCalificacion: number;
    idUsuario: string;
    idAbogado: string;
    atencion: number;
    profesionalismo: number;
    claridad: number;
    empatia: number;
    comentarioOpcional: string | null;
    fecha: string;
    usuario?: Usuario;
    abogado?: Abogado;
}

export interface CalificacionPromedio {
    atencionPromedio: number;
    profesionalismoPromedio: number;
    claridadPromedio: number;
    empatiaPromedio: number;
    promedioGeneral: number;
}

export interface CreateCalificacionRequest {
    atencion: number;
    profesionalismo: number;
    claridad: number;
    empatia: number;
    comentarioOpcional: string | null;
}