import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UsuarioState {
    private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
    public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

    private usuariosInactivosSubject = new BehaviorSubject<Usuario[]>([]);
    public usuariosInactivos$: Observable<Usuario[]> = this.usuariosInactivosSubject.asObservable();

    private usuarioSeleccionadoSubject = new BehaviorSubject<Usuario | null>(null);
    public usuarioSeleccionado$: Observable<Usuario | null> = this.usuarioSeleccionadoSubject.asObservable();

   
    get usuarios(): Usuario[] {
        return this.usuariosSubject.value;
    }

  
    get usuariosInactivos(): Usuario[] {
        return this.usuariosInactivosSubject.value;
    }

   
    get usuarioSeleccionado(): Usuario | null {
        return this.usuarioSeleccionadoSubject.value;
    }

  
    setUsuarios(usuarios: Usuario[]): void {
        this.usuariosSubject.next(usuarios);
    }

 
    setUsuariosInactivos(usuarios: Usuario[]): void {
        this.usuariosInactivosSubject.next(usuarios);
    }

   
    setUsuarioSeleccionado(usuario: Usuario | null): void {
        this.usuarioSeleccionadoSubject.next(usuario);
    }

    activarUsuario(usuarioId: string): void {
        const inactivo = this.usuariosInactivos.find(u => u.idUsuario === usuarioId);

        if (inactivo) {
            const usuarioActivado = { ...inactivo, activo: true };

            const inactivos = this.usuariosInactivosSubject.value.filter(
                u => u.idUsuario !== usuarioId
            );
            this.usuariosInactivosSubject.next(inactivos);

            const usuarios = [usuarioActivado, ...this.usuariosSubject.value];
            this.usuariosSubject.next(usuarios);
        }
    }

    
    updateUsuario(usuarioActualizado: Usuario): void {
        const usuarios = this.usuariosSubject.value.map(u =>
            u.idUsuario === usuarioActualizado.idUsuario ? usuarioActualizado : u
        );
        this.usuariosSubject.next(usuarios);

        if (this.usuarioSeleccionado?.idUsuario === usuarioActualizado.idUsuario) {
            this.usuarioSeleccionadoSubject.next(usuarioActualizado);
        }
    }

   
    deleteUsuario(usuarioId: string): void {
        const usuarios = this.usuariosSubject.value.filter(u => u.idUsuario !== usuarioId);
        this.usuariosSubject.next(usuarios);

        const inactivos = this.usuariosInactivosSubject.value.filter(u => u.idUsuario !== usuarioId);
        this.usuariosInactivosSubject.next(inactivos);
    }

   
    findUsuarioById(id: string): Usuario | undefined {
        return this.usuarios.find(u => u.idUsuario === id) ||
            this.usuariosInactivos.find(u => u.idUsuario === id);
    }

  
    clear(): void {
        this.usuariosSubject.next([]);
        this.usuariosInactivosSubject.next([]);
        this.usuarioSeleccionadoSubject.next(null);
    }
}