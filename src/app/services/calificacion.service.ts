import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
    Calificacion,
    CalificacionPromedio,
    CreateCalificacionRequest
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class CalificacionService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    getByAbogadoId(abogadoId: string): Observable<Calificacion[]> {
        return this.http.get<Calificacion[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.calificaciones}/abogado/${abogadoId}`
        );
    }


    getPromedios(abogadoId: string): Observable<CalificacionPromedio> {
        return this.http.get<CalificacionPromedio>(
            `${this.baseUrl}${API_CONFIG.endpoints.calificaciones}/abogado/${abogadoId}/promedios`
        );
    }

    getById(id: number): Observable<Calificacion> {
        return this.http.get<Calificacion>(
            `${this.baseUrl}${API_CONFIG.endpoints.calificaciones}/${id}`
        );
    }


    getPromedioGeneral(abogadoId: string): Observable<{ promedioGeneral: number }> {
        return this.http.get<{ promedioGeneral: number }>(
            `${this.baseUrl}${API_CONFIG.endpoints.calificaciones}/promedio/${abogadoId}`
        );
    }


    getPromediosPorRespuesta(respuestaId: number): Observable<any> {
        return this.http.get(
            `${this.baseUrl}${API_CONFIG.endpoints.calificaciones}/promedios/respuesta/${respuestaId}`
        );
    }


    create(
        abogadoId: string,
        data: CreateCalificacionRequest
    ): Observable<Calificacion> {
        return this.http.post<Calificacion>(
            `${this.baseUrl}${API_CONFIG.endpoints.calificaciones}/abogado/${abogadoId}`,
            data
        );
    }
}