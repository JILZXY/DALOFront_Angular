import { Abogado } from './abogado.model';
import { Especialidad } from './shared.model';

export interface Bufete {
    id: number;
    adminBufeteId: string;
    nombre: string;
    descripcion: string | null;
    logo: string | null;
    fechaCreacion: string;
    calificacionPromedio: number;
    abogados: Abogado[];
    especialidades: Especialidad[];
}

export interface SolicitudBufete {
    id: number;
    abogadoId: string;
    bufeteId: number;
    estado: string;
    fechaSolicitud: string;
    fechaAceptacion: string | null;
    abogado?: Abogado;
    bufete?: Bufete;
}

export interface CalificacionBufete {
    id: number;
    usuarioClienteId: string;
    bufeteId: number;
    calificacionGeneral: number;
    mensaje: string;
    fechaCalificacion: string;
}

export interface CreateBufeteRequest {
    nombre: string;
    descripcion: string | null;
    logo: string | null;
    especialidadesIds: number[];
}

export interface CreateSolicitudBufeteRequest {
    bufeteId: number;
}

export interface UpdateSolicitudEstadoRequest {
    estado: string;
}

export interface CreateCalificacionBufeteRequest {
    calificacionGeneral: number;
    mensaje: string;
}