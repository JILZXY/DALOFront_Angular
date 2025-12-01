import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { RespuestaConsulta, CreateRespuestaRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class RespuestaConsultaService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Obtener todas las respuestas de una consulta
     * GET /api/consultas/{consultaId}/respuestas
     */
    getByConsultaId(consultaId: number): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}/api/consultas/${consultaId}/respuestas`
        );
    }

    /**
     * Obtener respuesta por ID
     * GET /api/respuestas/{id}
     */
    getById(id: number): Observable<RespuestaConsulta> {
        return this.http.get<RespuestaConsulta>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}`
        );
    }

    /**
     * Obtener total de respuestas de un abogado
     * GET /abogado/{id}/total
     */
    getTotalByAbogado(abogadoId: string): Observable<{ total: number }> {
        return this.http.get<{ total: number }>(
            `${this.baseUrl}/abogado/${abogadoId}/total`
        );
    }

    /**
     * Obtener todas las respuestas de un abogado
     * GET /abogado/{id}
     */
    getByAbogadoId(abogadoId: string): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}/abogado/${abogadoId}`
        );
    }

    /**
     * Obtener respuestas por consulta (ruta alternativa)
     * GET /consulta/{id}
     */
    getByConsulta(consultaId: number): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}/consulta/${consultaId}`
        );
    }

    /**
     * Crear nueva respuesta a una consulta (Abogado)
     * POST /api/consultas/{consultaId}/respuestas
     */
    create(consultaId: number, data: CreateRespuestaRequest): Observable<RespuestaConsulta> {
        return this.http.post<RespuestaConsulta>(
            `${this.baseUrl}/api/consultas/${consultaId}/respuestas`,
            data
        );
    }

    /**
     * Dar like a una respuesta
     * POST /api/respuestas/{id}/like
     */
    addLike(id: number): Observable<void> {
        return this.http.post<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}/like`,
            {}
        );
    }

    /**
     * Eliminar respuesta (Dueño de la respuesta)
     * DELETE /api/respuestas/{id}
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}`
        );
    }
}