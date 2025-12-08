import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Especialidad } from '../models';

@Injectable({
    providedIn: 'root'
})
export class EspecialidadState {
    private especialidadesSubject = new BehaviorSubject<Especialidad[]>([]);
    public especialidades$: Observable<Especialidad[]> = this.especialidadesSubject.asObservable();

    private especialidadSeleccionadaSubject = new BehaviorSubject<Especialidad | null>(null);
    public especialidadSeleccionada$: Observable<Especialidad | null> = this.especialidadSeleccionadaSubject.asObservable();

 
    get especialidades(): Especialidad[] {
        return this.especialidadesSubject.value;
    }

   
    get especialidadSeleccionada(): Especialidad | null {
        return this.especialidadSeleccionadaSubject.value;
    }

   
    setEspecialidades(especialidades: Especialidad[]): void {
        this.especialidadesSubject.next(especialidades);
    }

    
    setEspecialidadSeleccionada(especialidad: Especialidad | null): void {
        this.especialidadSeleccionadaSubject.next(especialidad);
    }

    
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