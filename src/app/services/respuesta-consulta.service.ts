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

    
    getByConsultaId(consultaId: number): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}/api/consultas/${consultaId}/respuestas`
        );
    }

   
    getById(id: number): Observable<RespuestaConsulta> {
        return this.http.get<RespuestaConsulta>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}`
        );
    }

    
    getTotalByAbogado(abogadoId: string): Observable<{ total: number }> {
        return this.http.get<{ total: number }>(
            `${this.baseUrl}/abogado/${abogadoId}/total`
        );
    }

    
    getByAbogadoId(abogadoId: string): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}/abogado/${abogadoId}`
        );
    }

    getByConsulta(consultaId: number): Observable<RespuestaConsulta[]> {
        return this.http.get<RespuestaConsulta[]>(
            `${this.baseUrl}/consulta/${consultaId}`
        );
    }

    
    create(consultaId: number, data: CreateRespuestaRequest): Observable<RespuestaConsulta> {
        return this.http.post<RespuestaConsulta>(
            `${this.baseUrl}/api/consultas/${consultaId}/respuestas`,
            data
        );
    }

    addLike(id: number): Observable<void> {
        return this.http.post<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}/like`,
            {}
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.respuestas}/${id}`
        );
    }
}