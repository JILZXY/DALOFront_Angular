import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Abogado } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AbogadoState {
    // Lista de abogados
    private abogadosSubject = new BehaviorSubject<Abogado[]>([]);
    public abogados$: Observable<Abogado[]> = this.abogadosSubject.asObservable();

    // Abogado actual (perfil seleccionado)
    private abogadoActualSubject = new BehaviorSubject<Abogado | null>(null);
    public abogadoActual$: Observable<Abogado | null> = this.abogadoActualSubject.asObservable();

    // Estado de carga
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    /**
     * Obtener abogados (valor instantáneo)
     */
    get abogados(): Abogado[] {
        return this.abogadosSubject.value;
    }

    /**
     * Obtener abogado actual (valor instantáneo)
     */
    get abogadoActual(): Abogado | null {
        return this.abogadoActualSubject.value;
    }

    /**
     * Establecer lista de abogados
     */
    setAbogados(abogados: Abogado[]): void {
        this.abogadosSubject.next(abogados);
    }

    /**
     * Establecer abogado actual
     */
    setAbogadoActual(abogado: Abogado | null): void {
        this.abogadoActualSubject.next(abogado);
    }

    /**
     * Buscar abogado por ID en el state
     */
    findAbogadoById(id: string): Abogado | undefined {
        return this.abogados.find(a => a.idUsuario === id);
    }

    /**
     * Actualizar un abogado en la lista
     */
    updateAbogado(abogadoActualizado: Abogado): void {
        const abogados = this.abogadosSubject.value.map(a =>
            a.idUsuario === abogadoActualizado.idUsuario ? abogadoActualizado : a
        );
        this.abogadosSubject.next(abogados);

        // Si es el abogado actual, actualizarlo también
        if (this.abogadoActual?.idUsuario === abogadoActualizado.idUsuario) {
            this.abogadoActualSubject.next(abogadoActualizado);
        }
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
        this.abogadosSubject.next([]);
        this.abogadoActualSubject.next(null);
        this.loadingSubject.next(false);
    }
}