import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bufete, SolicitudBufete } from '../models';

@Injectable({
    providedIn: 'root'
})
export class BufeteState {
    // Lista de bufetes
    private bufetesSubject = new BehaviorSubject<Bufete[]>([]);
    public bufetes$: Observable<Bufete[]> = this.bufetesSubject.asObservable();

    // Mis bufetes (administrados por mí)
    private misBufetesSubject = new BehaviorSubject<Bufete[]>([]);
    public misBufetes$: Observable<Bufete[]> = this.misBufetesSubject.asObservable();

    // Bufete actual seleccionado
    private bufeteActualSubject = new BehaviorSubject<Bufete | null>(null);
    public bufeteActual$: Observable<Bufete | null> = this.bufeteActualSubject.asObservable();

    // Solicitudes pendientes
    private solicitudesSubject = new BehaviorSubject<SolicitudBufete[]>([]);
    public solicitudes$: Observable<SolicitudBufete[]> = this.solicitudesSubject.asObservable();

    /**
     * Obtener bufetes (valor instantáneo)
     */
    get bufetes(): Bufete[] {
        return this.bufetesSubject.value;
    }

    /**
     * Obtener mis bufetes (valor instantáneo)
     */
    get misBufetes(): Bufete[] {
        return this.misBufetesSubject.value;
    }

    /**
     * Obtener bufete actual (valor instantáneo)
     */
    get bufeteActual(): Bufete | null {
        return this.bufeteActualSubject.value;
    }

    /**
     * Establecer lista de bufetes
     */
    setBufetes(bufetes: Bufete[]): void {
        this.bufetesSubject.next(bufetes);
    }

    /**
     * Establecer mis bufetes
     */
    setMisBufetes(bufetes: Bufete[]): void {
        this.misBufetesSubject.next(bufetes);
    }

    /**
     * Establecer bufete actual
     */
    setBufeteActual(bufete: Bufete | null): void {
        this.bufeteActualSubject.next(bufete);
    }

    /**
     * Establecer solicitudes
     */
    setSolicitudes(solicitudes: SolicitudBufete[]): void {
        this.solicitudesSubject.next(solicitudes);
    }

    /**
     * Agregar nuevo bufete
     */
    addBufete(bufete: Bufete): void {
        const bufetes = [bufete, ...this.bufetesSubject.value];
        this.bufetesSubject.next(bufetes);

        const misBufetes = [bufete, ...this.misBufetesSubject.value];
        this.misBufetesSubject.next(misBufetes);
    }

    /**
     * Actualizar bufete
     */
    updateBufete(bufeteActualizado: Bufete): void {
        const bufetes = this.bufetesSubject.value.map(b =>
            b.id === bufeteActualizado.id ? bufeteActualizado : b
        );
        this.bufetesSubject.next(bufetes);

        const misBufetes = this.misBufetesSubject.value.map(b =>
            b.id === bufeteActualizado.id ? bufeteActualizado : b
        );
        this.misBufetesSubject.next(misBufetes);
    }

    /**
     * Eliminar bufete
     */
    deleteBufete(bufeteId: number): void {
        const bufetes = this.bufetesSubject.value.filter(b => b.id !== bufeteId);
        this.bufetesSubject.next(bufetes);

        const misBufetes = this.misBufetesSubject.value.filter(b => b.id !== bufeteId);
        this.misBufetesSubject.next(misBufetes);
    }

    /**
     * Limpiar estado
     */
    clear(): void {
        this.bufetesSubject.next([]);
        this.misBufetesSubject.next([]);
        this.bufeteActualSubject.next(null);
        this.solicitudesSubject.next([]);
    }
}