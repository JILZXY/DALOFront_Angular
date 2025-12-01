import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RespuestaConsulta } from '../models';

@Injectable({
    providedIn: 'root'
})
export class RespuestaConsultaState {
    // Respuestas de la consulta actual
    private respuestasSubject = new BehaviorSubject<RespuestaConsulta[]>([]);
    public respuestas$: Observable<RespuestaConsulta[]> = this.respuestasSubject.asObservable();

    // Mis respuestas (como abogado)
    private misRespuestasSubject = new BehaviorSubject<RespuestaConsulta[]>([]);
    public misRespuestas$: Observable<RespuestaConsulta[]> = this.misRespuestasSubject.asObservable();

    // Estado de carga
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    /**
     * Obtener respuestas (valor instantáneo)
     */
    get respuestas(): RespuestaConsulta[] {
        return this.respuestasSubject.value;
    }

    /**
     * Obtener mis respuestas (valor instantáneo)
     */
    get misRespuestas(): RespuestaConsulta[] {
        return this.misRespuestasSubject.value;
    }

    /**
     * Establecer respuestas de una consulta
     */
    setRespuestas(respuestas: RespuestaConsulta[]): void {
        this.respuestasSubject.next(respuestas);
    }

    /**
     * Establecer mis respuestas
     */
    setMisRespuestas(respuestas: RespuestaConsulta[]): void {
        this.misRespuestasSubject.next(respuestas);
    }

    /**
     * Agregar una nueva respuesta
     */
    addRespuesta(respuesta: RespuestaConsulta): void {
        const actuales = this.respuestasSubject.value;
        this.respuestasSubject.next([respuesta, ...actuales]);

        // También agregar a mis respuestas si soy el autor
        const misActuales = this.misRespuestasSubject.value;
        this.misRespuestasSubject.next([respuesta, ...misActuales]);
    }

    /**
     * Actualizar una respuesta (por ejemplo, después de un like)
     */
    updateRespuesta(respuestaActualizada: RespuestaConsulta): void {
        // Actualizar en respuestas
        const respuestas = this.respuestasSubject.value.map(r =>
            r.idRespuesta === respuestaActualizada.idRespuesta ? respuestaActualizada : r
        );
        this.respuestasSubject.next(respuestas);

        // Actualizar en mis respuestas
        const misRespuestas = this.misRespuestasSubject.value.map(r =>
            r.idRespuesta === respuestaActualizada.idRespuesta ? respuestaActualizada : r
        );
        this.misRespuestasSubject.next(misRespuestas);
    }

    /**
     * Incrementar likes de una respuesta
     */
    incrementLikes(respuestaId: number): void {
        // Incrementar en respuestas
        const respuestas = this.respuestasSubject.value.map(r =>
            r.idRespuesta === respuestaId ? { ...r, likes: r.likes + 1 } : r
        );
        this.respuestasSubject.next(respuestas);

        // Incrementar en mis respuestas
        const misRespuestas = this.misRespuestasSubject.value.map(r =>
            r.idRespuesta === respuestaId ? { ...r, likes: r.likes + 1 } : r
        );
        this.misRespuestasSubject.next(misRespuestas);
    }

    /**
     * Eliminar una respuesta
     */
    deleteRespuesta(respuestaId: number): void {
        // Eliminar de respuestas
        const respuestas = this.respuestasSubject.value.filter(
            r => r.idRespuesta !== respuestaId
        );
        this.respuestasSubject.next(respuestas);

        // Eliminar de mis respuestas
        const misRespuestas = this.misRespuestasSubject.value.filter(
            r => r.idRespuesta !== respuestaId
        );
        this.misRespuestasSubject.next(misRespuestas);
    }

    /**
     * Buscar respuesta por ID
     */
    findRespuestaById(id: number): RespuestaConsulta | undefined {
        return this.respuestas.find(r => r.idRespuesta === id);
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
        this.respuestasSubject.next([]);
        this.misRespuestasSubject.next([]);
        this.loadingSubject.next(false);
    }
}