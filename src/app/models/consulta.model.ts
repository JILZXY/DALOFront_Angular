import { Usuario } from './usuario.model';
import { Abogado } from './abogado.model';
import { Especialidad } from './shared.model';

export interface Consulta {
    idConsulta: number;
    idUsuario: string;
    titulo: string;
    pregunta: string;
    fechaPublicacion: string;
    esPrivada: boolean;
    estado: string;
    usuario?: Usuario;
    especialidades: Especialidad[];
    respuestas: RespuestaConsulta[];
}

export interface RespuestaConsulta {
    idRespuesta: number;
    idConsulta: number;
    idAbogado: string;
    respuesta: string;
    fechaRespuesta: string;
    likes: number;
    abogado?: Abogado;
}

export interface CreateConsultaRequest {
    titulo: string;
    pregunta: string;
    esPrivada: boolean;
    especialidadesIds: number[];
}

export interface CreateRespuestaRequest {
    respuesta: string;
}

export interface UpdateEstadoConsultaRequest {
    estado: string;
}