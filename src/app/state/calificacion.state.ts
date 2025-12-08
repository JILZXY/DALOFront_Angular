import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Calificacion, CalificacionPromedio } from '../models';

@Injectable({
    providedIn: 'root'
})
export class CalificacionState {
    
    private calificacionesSubject = new BehaviorSubject<Calificacion[]>([]);
    public calificaciones$: Observable<Calificacion[]> = this.calificacionesSubject.asObservable();

    private promediosSubject = new BehaviorSubject<CalificacionPromedio | null>(null);
    public promedios$: Observable<CalificacionPromedio | null> = this.promediosSubject.asObservable();

    private promedioGeneralSubject = new BehaviorSubject<number>(0);
    public promedioGeneral$: Observable<number> = this.promedioGeneralSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

 
    get calificaciones(): Calificacion[] {
        return this.calificacionesSubject.value;
    }

    
    get promedios(): CalificacionPromedio | null {
        return this.promediosSubject.value;
    }

    
    get promedioGeneral(): number {
        return this.promedioGeneralSubject.value;
    }

    
    setCalificaciones(calificaciones: Calificacion[]): void {
        this.calificacionesSubject.next(calificaciones);
    }

   
    setPromedios(promedios: CalificacionPromedio): void {
        this.promediosSubject.next(promedios);
        this.promedioGeneralSubject.next(promedios.promedioGeneral);
    }

   
    setPromedioGeneral(promedio: number): void {
        this.promedioGeneralSubject.next(promedio);
    }

    
    addCalificacion(calificacion: Calificacion): void {
        const actuales = this.calificacionesSubject.value;
        this.calificacionesSubject.next([calificacion, ...actuales]);
    }

   
    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    clear(): void {
        this.calificacionesSubject.next([]);
        this.promediosSubject.next(null);
        this.promedioGeneralSubject.next(0);
        this.loadingSubject.next(false);
    }
}