import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
    Consulta,
    CreateConsultaRequest,
    UpdateEstadoConsultaRequest,
    RespuestaConsulta,
    CreateRespuestaRequest
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ConsultaService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    getAll(especialidadId?: number): Observable<Consulta[]> {
        let params = new HttpParams();
        if (especialidadId) {
            params = params.set('especialidadId', especialidadId.toString());
        }

        return this.http.get<Consulta[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}`,
            { params }
        );
    }

    getById(id: number): Observable<Consulta> {
        return this.http.get<Consulta>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/${id}`
        );
    }

    getMisConsultas(): Observable<Consulta[]> {
        return this.http.get<Consulta[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.misConsultas}`
        );
    }

    getByMateria(materiaId: number): Observable<Consulta[]> {
        const params = new HttpParams().set('materiaId', materiaId.toString());

        return this.http.get<Consulta[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/materia`,
            { params }
        );
    }

    getByLocalidad(estadoId?: number, municipioId?: number): Observable<Consulta[]> {
        let params = new HttpParams();

        if (estadoId) {
            params = params.set('estadoId', estadoId.toString());
        }
        if (municipioId) {
            params = params.set('municipioId', municipioId.toString());
        }

        return this.http.get<Consulta[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/localidad`,
            { params }
        );
    }

    getByMateriaYLocalidad(
        materiaId: number,
        estadoId?: number,
        municipioId?: number
    ): Observable<Consulta[]> {
        let params = new HttpParams().set('materiaId', materiaId.toString());

        if (estadoId) {
            params = params.set('estadoId', estadoId.toString());
        }
        if (municipioId) {
            params = params.set('municipioId', municipioId.toString());
        }

        return this.http.get<Consulta[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/materiaLocalidad`,
            { params }
        );
    }

    getTotalByUsuarioId(usuarioId: string): Observable<{ total: number }> {
        return this.http.get<{ total: number }>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/usuario/${usuarioId}/total`
        );
    }

    getByUsuarioId(usuarioId: string): Observable<Consulta[]> {
        return this.http.get<Consulta[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/por-id/${usuarioId}`
        );
    }

    create(data: CreateConsultaRequest): Observable<Consulta> {
        return this.http.post<Consulta>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}`,
            data
        );
    }

    updateEstado(id: number, data: UpdateEstadoConsultaRequest): Observable<void> {
        return this.http.patch<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/${id}/estado`,
            data
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/${id}`
        );
    }

    getRespuestas(consultaId: number): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/${consultaId}/respuestas`
        );
    }

    createRespuesta(
        consultaId: number,
        data: CreateRespuestaRequest
    ): Observable<RespuestaConsulta> {
        return this.http.post<RespuestaConsulta>(
            `${this.baseUrl}${API_CONFIG.endpoints.consultas}/${consultaId}/respuestas`,
            data
        );
    }

    getRespuestaById(id: number): Observable<RespuestaConsulta> {
        return this.http.get<RespuestaConsulta>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}`
        );
    }

    likeRespuesta(id: number): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}/like`,
            {}
        );
    }

    deleteRespuesta(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}`
        );
    }

    getTotalRespuestasByAbogado(abogadoId: string): Observable<{ total: number }> {
        return this.http.get<{ total: number }>(
            `${this.baseUrl}/abogado/${abogadoId}/total`
        );
    }

    getRespuestasByAbogado(abogadoId: string): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}/abogado/${abogadoId}`
        );
    }

    marcarMejorRespuesta(idRespuesta: number): Observable<void> {
        return this.http.put<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/mejor/${idRespuesta}`,
            {}
        );
    }
}