import { Usuario } from './usuario.model';
import { Especialidad } from './shared.model';

export interface Abogado {
    idAbogado?: string; // Changed from idUsuario to match user's previous edit attempt and state usage
    idUsuario?: string; // Keeping both for compatibility if needed, or just one. Let's stick to idAbogado as primary if that's the intent.
    // Actually, looking at the error "Property 'idUsuario' does not exist on type 'Abogado'", the state uses idUsuario.
    // But the user tried to change it to idAbogado in the state.
    // Let's standardize on idAbogado if that's what the user wants, OR idUsuario.
    // The user's previous edit to state changed idUsuario -> idAbogado.
    // So I should define idAbogado in the model.
    cedulaProfesional: string | null;
    biografia: string | null;
    descripcion?: string;
    calificacionPromedio?: number;
    usuario?: Usuario;
    especialidades?: Especialidad[];
}