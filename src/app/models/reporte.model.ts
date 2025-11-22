import { Usuario } from './usuario.model';

export interface Reporte {
    id: number;
    usuarioReportaId: string;
    usuarioReportadoId: string;
    motivoReporteId: number;
    consultaId: number | null;
    fechaReporte: string;
    comentarios: string | null;
    usuarioReporta?: Usuario;
    usuarioReportado?: Usuario;
    motivoReporte?: MotivoReporte;
}

export interface MotivoReporte {
    id: number;
    nombre: string;
    descripcion: string | null;
}

export interface CreateReporteRequest {
    usuarioReportadoId: string;
    motivoReporteId: number;
    consultaId: number | null;
    comentarios: string | null;
}