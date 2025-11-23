import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
    Reporte,
    MotivoReporte,
    CreateReporteRequest
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Reporte[]> {
        return this.http.get<Reporte[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.reportes}`
        );
    }

    getById(id: number): Observable<Reporte> {
        return this.http.get<Reporte>(
            `${this.baseUrl}${API_CONFIG.endpoints.reportes}/${id}`
        );
    }

    getMisReportes(): Observable<Reporte[]> {
        return this.http.get<Reporte[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.reportes}/mis-reportes`
        );
    }

    getReportesContraMi(): Observable<Reporte[]> {
        return this.http.get<Reporte[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.reportes}/contra-mi`
        );
    }

    getByUsuarioId(usuarioId: string): Observable<Reporte[]> {
        return this.http.get<Reporte[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.reportes}/usuario/${usuarioId}`
        );
    }

    create(data: CreateReporteRequest): Observable<Reporte> {
        return this.http.post<Reporte>(
            `${this.baseUrl}${API_CONFIG.endpoints.reportes}`,
            data
        );
    }


    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.reportes}/${id}`
        );
    }

    getMotivosReporte(): Observable<MotivoReporte[]> {
        return this.http.get<MotivoReporte[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.motivosReporte}`
        );
    }
}