export interface Especialidad {
    id: number;
    nombreMateria: string;
    descripcion: string | null;
}

export enum Roles {
    CLIENTE = 1,
    ABOGADO = 2,
    ADMIN = 3
}

export enum EstadoConsulta {
    ABIERTA = 'abierta',
    ATENDIDA = 'atendida',
    CERRADA = 'cerrada'
}

export enum EstadoSolicitud {
    PENDIENTE = 'Pendiente',
    APROBADO = 'Aprobado',
    RECHAZADO = 'Rechazado'
}