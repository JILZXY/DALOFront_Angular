import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UsuarioState {
    // Lista de usuarios (para admin)
    private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
    public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

    // Usuarios inactivos (para admin)
    private usuariosInactivosSubject = new BehaviorSubject<Usuario[]>([]);
    public usuariosInactivos$: Observable<Usuario[]> = this.usuariosInactivosSubject.asObservable();

    // Usuario seleccionado (perfil)
    private usuarioSeleccionadoSubject = new BehaviorSubject<Usuario | null>(null);
    public usuarioSeleccionado$: Observable<Usuario | null> = this.usuarioSeleccionadoSubject.asObservable();

    /**
     * Obtener usuarios (valor instantáneo)
     */
    get usuarios(): Usuario[] {
        return this.usuariosSubject.value;
    }

    /**
     * Obtener usuarios inactivos (valor instantáneo)
     */
    get usuariosInactivos(): Usuario[] {
        return this.usuariosInactivosSubject.value;
    }

    /**
     * Obtener usuario seleccionado (valor instantáneo)
     */
    get usuarioSeleccionado(): Usuario | null {
        return this.usuarioSeleccionadoSubject.value;
    }

    /**
     * Establecer lista de usuarios
     */
    setUsuarios(usuarios: Usuario[]): void {
        this.usuariosSubject.next(usuarios);
    }

    /**
     * Establecer usuarios inactivos
     */
    setUsuariosInactivos(usuarios: Usuario[]): void {
        this.usuariosInactivosSubject.next(usuarios);
    }

    /**
     * Establecer usuario seleccionado
     */
    setUsuarioSeleccionado(usuario: Usuario | null): void {
        this.usuarioSeleccionadoSubject.next(usuario);
    }

    /**
     * Activar un usuario (moverlo de inactivos a activos)
     */
    activarUsuario(usuarioId: string): void {
        // Buscar en inactivos
        const inactivo = this.usuariosInactivos.find(u => u.idUsuario === usuarioId);

        if (inactivo) {
            // Actualizar estado activo
            const usuarioActivado = { ...inactivo, activo: true };

            // Remover de inactivos
            const inactivos = this.usuariosInactivosSubject.value.filter(
                u => u.idUsuario !== usuarioId
            );
            this.usuariosInactivosSubject.next(inactivos);

            // Agregar a usuarios activos
            const usuarios = [usuarioActivado, ...this.usuariosSubject.value];
            this.usuariosSubject.next(usuarios);
        }
    }

    /**
     * Actualizar un usuario
     */
    updateUsuario(usuarioActualizado: Usuario): void {
        // Actualizar en la lista general
        const usuarios = this.usuariosSubject.value.map(u =>
            u.idUsuario === usuarioActualizado.idUsuario ? usuarioActualizado : u
        );
        this.usuariosSubject.next(usuarios);

        // Si es el usuario seleccionado, actualizarlo
        if (this.usuarioSeleccionado?.idUsuario === usuarioActualizado.idUsuario) {
            this.usuarioSeleccionadoSubject.next(usuarioActualizado);
        }
    }

    /**
     * Eliminar un usuario
     */
    deleteUsuario(usuarioId: string): void {
        const usuarios = this.usuariosSubject.value.filter(u => u.idUsuario !== usuarioId);
        this.usuariosSubject.next(usuarios);

        const inactivos = this.usuariosInactivosSubject.value.filter(u => u.idUsuario !== usuarioId);
        this.usuariosInactivosSubject.next(inactivos);
    }

    /**
     * Buscar usuario por ID
     */
    findUsuarioById(id: string): Usuario | undefined {
        return this.usuarios.find(u => u.idUsuario === id) ||
            this.usuariosInactivos.find(u => u.idUsuario === id);
    }

    /**
     * Limpiar estado
     */
    clear(): void {
        this.usuariosSubject.next([]);
        this.usuariosInactivosSubject.next([]);
        this.usuarioSeleccionadoSubject.next(null);
    }
}