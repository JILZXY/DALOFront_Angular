import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Calificacion, CalificacionPromedio } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CalificacionState {
    // Calificaciones de un abogado
    private calificacionesSubject = new BehaviorSubject<Calificacion[]>([]);
    public calificaciones$: Observable<Calificacion[]> = this.calificacionesSubject.asObservable();

    // Promedios de calificación de un abogado
    private promediosSubject = new BehaviorSubject<CalificacionPromedio | null>(null);
    public promedios$: Observable<CalificacionPromedio | null> = this.promediosSubject.asObservable();

    // Promedio general de un abogado
    private promedioGeneralSubject = new BehaviorSubject<number>(0);
    public promedioGeneral$: Observable<number> = this.promedioGeneralSubject.asObservable();

    // Estado de carga
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    /**
     * Obtener calificaciones (valor instantáneo)
     */
    get calificaciones(): Calificacion[] {
        return this.calificacionesSubject.value;
    }

    /**
     * Obtener promedios (valor instantáneo)
     */
    get promedios(): CalificacionPromedio | null {
        return this.promediosSubject.value;
    }

    /**
     * Obtener promedio general (valor instantáneo)
     */
    get promedioGeneral(): number {
        return this.promedioGeneralSubject.value;
    }

    /**
     * Establecer calificaciones de un abogado
     */
    setCalificaciones(calificaciones: Calificacion[]): void {
        this.calificacionesSubject.next(calificaciones);
    }

    /**
     * Establecer promedios de calificación
     */
    setPromedios(promedios: CalificacionPromedio): void {
        this.promediosSubject.next(promedios);
        this.promedioGeneralSubject.next(promedios.promedioGeneral);
    }

    /**
     * Establecer promedio general
     */
    setPromedioGeneral(promedio: number): void {
        this.promedioGeneralSubject.next(promedio);
    }

    /**
     * Agregar una nueva calificación
     */
    addCalificacion(calificacion: Calificacion): void {
        const actuales = this.calificacionesSubject.value;
        this.calificacionesSubject.next([calificacion, ...actuales]);
    }

    /**
     * Establecer estado de carga
     */
    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    /**
     * Limpiar todo el estado
     */
    clear(): void {
        this.calificacionesSubject.next([]);
        this.promediosSubject.next(null);
        this.promedioGeneralSubject.next(0);
        this.loadingSubject.next(false);
    }
}