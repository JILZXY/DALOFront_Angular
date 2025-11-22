import { Usuario } from './usuario.model';
import { Abogado } from './abogado.model';

export interface Chat {
    id: number;
    usuarioClienteId: string;
    usuarioAbogadoId: string;
    fechaInicio: string;
    cliente?: Usuario;
    abogado?: Abogado;
    ultimoMensaje?: Mensaje;
}

export interface Mensaje {
    id: number;
    chatId: number;
    remitenteId: string;
    mensaje: string;
    fecha: string;
    remitente?: Usuario;
}

export interface CreateChatRequest {
    usuarioAbogadoId: string;
}

export interface SendMensajeRequest {
    mensaje: string;
}