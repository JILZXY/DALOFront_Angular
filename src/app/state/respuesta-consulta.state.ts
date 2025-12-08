import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RespuestaConsulta } from '../models';

@Injectable({
    providedIn: 'root'
})
export class RespuestaConsultaState {
    private respuestasSubject = new BehaviorSubject<RespuestaConsulta[]>([]);
    public respuestas$: Observable<RespuestaConsulta[]> = this.respuestasSubject.asObservable();

    private misRespuestasSubject = new BehaviorSubject<RespuestaConsulta[]>([]);
    public misRespuestas$: Observable<RespuestaConsulta[]> = this.misRespuestasSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    
    get respuestas(): RespuestaConsulta[] {
        return this.respuestasSubject.value;
    }

    
    get misRespuestas(): RespuestaConsulta[] {
        return this.misRespuestasSubject.value;
    }

   
    setRespuestas(respuestas: RespuestaConsulta[]): void {
        this.respuestasSubject.next(respuestas);
    }

   
    setMisRespuestas(respuestas: RespuestaConsulta[]): void {
        this.misRespuestasSubject.next(respuestas);
    }

    
    addRespuesta(respuesta: RespuestaConsulta): void {
        const actuales = this.respuestasSubject.value;
        this.respuestasSubject.next([respuesta, ...actuales]);

        const misActuales = this.misRespuestasSubject.value;
        this.misRespuestasSubject.next([respuesta, ...misActuales]);
    }

    
    updateRespuesta(respuestaActualizada: RespuestaConsulta): void {
        const respuestas = this.respuestasSubject.value.map(r =>
            r.idRespuesta === respuestaActualizada.idRespuesta ? respuestaActualizada : r
        );
        this.respuestasSubject.next(respuestas);

        const misRespuestas = this.misRespuestasSubject.value.map(r =>
            r.idRespuesta === respuestaActualizada.idRespuesta ? respuestaActualizada : r
        );
        this.misRespuestasSubject.next(misRespuestas);
    }

    
    incrementLikes(respuestaId: number): void {
        const respuestas = this.respuestasSubject.value.map(r =>
            r.idRespuesta === respuestaId ? { ...r, likes: r.likes + 1 } : r
        );
        this.respuestasSubject.next(respuestas);

        const misRespuestas = this.misRespuestasSubject.value.map(r =>
            r.idRespuesta === respuestaId ? { ...r, likes: r.likes + 1 } : r
        );
        this.misRespuestasSubject.next(misRespuestas);
    }

    
    deleteRespuesta(respuestaId: number): void {
        const respuestas = this.respuestasSubject.value.filter(
            r => r.idRespuesta !== respuestaId
        );
        this.respuestasSubject.next(respuestas);

        const misRespuestas = this.misRespuestasSubject.value.filter(
            r => r.idRespuesta !== respuestaId
        );
        this.misRespuestasSubject.next(misRespuestas);
    }

    
    findRespuestaById(id: number): RespuestaConsulta | undefined {
        return this.respuestas.find(r => r.idRespuesta === id);
    }

    
    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    
    clear(): void {
        this.respuestasSubject.next([]);
        this.misRespuestasSubject.next([]);
        this.loadingSubject.next(false);
    }
}