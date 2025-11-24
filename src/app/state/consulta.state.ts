import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Consulta } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ConsultaState {
    private consultasPublicasSubject = new BehaviorSubject<Consulta[]>([]);
    public consultasPublicas$: Observable<Consulta[]> = this.consultasPublicasSubject.asObservable();

    private misConsultasSubject = new BehaviorSubject<Consulta[]>([]);
    public misConsultas$: Observable<Consulta[]> = this.misConsultasSubject.asObservable();

    private consultaActualSubject = new BehaviorSubject<Consulta | null>(null);
    public consultaActual$: Observable<Consulta | null> = this.consultaActualSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    get consultasPublicas(): Consulta[] {
        return this.consultasPublicasSubject.value;
    }

    get misConsultas(): Consulta[] {
        return this.misConsultasSubject.value;
    }

    get consultaActual(): Consulta | null {
        return this.consultaActualSubject.value;
    }

    setConsultasPublicas(consultas: Consulta[]): void {
        this.consultasPublicasSubject.next(consultas);
    }

    setMisConsultas(consultas: Consulta[]): void {
        this.misConsultasSubject.next(consultas);
    }


    setConsultaActual(consulta: Consulta | null): void {
        this.consultaActualSubject.next(consulta);
    }


    addConsulta(consulta: Consulta): void {
        if (!consulta.esPrivada) {
            const actuales = this.consultasPublicasSubject.value;
            this.consultasPublicasSubject.next([consulta, ...actuales]);
        }

        const misActuales = this.misConsultasSubject.value;
        this.misConsultasSubject.next([consulta, ...misActuales]);
    }


    updateConsulta(consultaActualizada: Consulta): void {
        const publicas = this.consultasPublicasSubject.value.map(c =>
            c.idConsulta === consultaActualizada.idConsulta ? consultaActualizada : c
        );
        this.consultasPublicasSubject.next(publicas);

        const mias = this.misConsultasSubject.value.map(c =>
            c.idConsulta === consultaActualizada.idConsulta ? consultaActualizada : c
        );
        this.misConsultasSubject.next(mias);

        if (this.consultaActual?.idConsulta === consultaActualizada.idConsulta) {
            this.consultaActualSubject.next(consultaActualizada);
        }
    }


    deleteConsulta(consultaId: number): void {
        const publicas = this.consultasPublicasSubject.value.filter(
            c => c.idConsulta !== consultaId
        );
        this.consultasPublicasSubject.next(publicas);

        const mias = this.misConsultasSubject.value.filter(
            c => c.idConsulta !== consultaId
        );
        this.misConsultasSubject.next(mias);

        if (this.consultaActual?.idConsulta === consultaId) {
            this.consultaActualSubject.next(null);
        }
    }

    findConsultaById(id: number): Consulta | undefined {
        return this.consultasPublicas.find(c => c.idConsulta === id) ||
            this.misConsultas.find(c => c.idConsulta === id);
    }


    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    clear(): void {
        this.consultasPublicasSubject.next([]);
        this.misConsultasSubject.next([]);
        this.consultaActualSubject.next(null);
        this.loadingSubject.next(false);
    }
}