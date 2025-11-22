export interface Usuario {
    idUsuario: string;
    nombre: string;
    email: string;
    fechaRegistro: string;
    municipioId: number | null;
    rolId: number;
    activo: boolean;
    municipio?: Municipio;
    rol?: Rol;
}

export interface Municipio {
    id: number;
    nombre: string;
    estadoId: number;
    estado?: Estado;
}

export interface Estado {
    id: number;
    nombre: string;
}

export interface Rol {
    id: number;
    nombre: string;
}