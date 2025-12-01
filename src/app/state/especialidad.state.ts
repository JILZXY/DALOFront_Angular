import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Especialidad } from '../models';

@Injectable({
    providedIn: 'root'
})
export class EspecialidadState {
    // Catálogo de especialidades/materias
    private especialidadesSubject = new BehaviorSubject<Especialidad[]>([]);
    public especialidades$: Observable<Especialidad[]> = this.especialidadesSubject.asObservable();

    // Especialidad seleccionada (para filtros)
    private especialidadSeleccionadaSubject = new BehaviorSubject<Especialidad | null>(null);
    public especialidadSeleccionada$: Observable<Especialidad | null> = this.especialidadSeleccionadaSubject.asObservable();

    /**
     * Obtener especialidades (valor instantáneo)
     */
    get especialidades(): Especialidad[] {
        return this.especialidadesSubject.value;
    }

    /**
     * Obtener especialidad seleccionada (valor instantáneo)
     */
    get especialidadSeleccionada(): Especialidad | null {
        return this.especialidadSeleccionadaSubject.value;
    }

    /**
     * Establecer catálogo de especialidades
     */
    setEspecialidades(especialidades: Especialidad[]): void {
        this.especialidadesSubject.next(especialidades);
    }

    /**
     * Establecer especialidad seleccionada
     */
    setEspecialidadSeleccionada(especialidad: Especialidad | null): void {
        this.especialidadSeleccionadaSubject.next(especialidad);
    }

    /**
     * Buscar especialidad por ID
     */
    findEspecialidadById(id: number): Especialidad | undefined {
        return this.especialidades.find(e => e.id === id);
    }

    /**
     * Buscar especialidades por IDs
     */
    findEspecialidadesByIds(ids: number[]): Especialidad[] {
        return this.especialidades.filter(e => ids.includes(e.id));
    }

    /**
     * Limpiar estado
     */
    clear(): void {
        this.especialidadesSubject.next([]);
        this.especialidadSeleccionadaSubject.next(null);
    }
}