import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import {
    Bufete,
    CreateBufeteRequest,
    SolicitudBufete,
    CreateSolicitudBufeteRequest,
    UpdateSolicitudEstadoRequest,
    CalificacionBufete,
    CreateCalificacionBufeteRequest,
    Abogado
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class BufeteService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Bufete[]> {
        return this.http.get<Bufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.bufetes}`
        );
    }

    getById(id: number): Observable<Bufete> {
        return this.http.get<Bufete>(
            `${this.baseUrl}${API_CONFIG.endpoints.bufetes}/${id}`
        );
    }

    getMisBufetes(): Observable<Bufete[]> {
        return this.http.get<Bufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.misBufetes}`
        );
    }

    create(data: CreateBufeteRequest): Observable<Bufete> {
        return this.http.post<Bufete>(
            `${this.baseUrl}${API_CONFIG.endpoints.bufetes}`,
            data
        );
    }

    update(id: number, data: Partial<Bufete>): Observable<Bufete> {
        return this.http.put<Bufete>(
            `${this.baseUrl}${API_CONFIG.endpoints.bufetes}/${id}`,
            data
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.bufetes}/${id}`
        );
    }

    createSolicitud(data: CreateSolicitudBufeteRequest): Observable<SolicitudBufete> {
        return this.http.post<SolicitudBufete>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}`,
            data
        );
    }

    getMisSolicitudes(): Observable<SolicitudBufete[]> {
        return this.http.get<SolicitudBufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/mis-solicitudes`
        );
    }

    getSolicitudesByBufete(bufeteId: number): Observable<SolicitudBufete[]> {
        return this.http.get<SolicitudBufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/bufete/${bufeteId}`
        );
    }

    updateSolicitud(
        id: number,
        data: UpdateSolicitudEstadoRequest
    ): Observable<void> {
        return this.http.patch<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/${id}`,
            data
        );
    }

    getCalificaciones(bufeteId: number): Observable<CalificacionBufete[]> {
        return this.http.get<CalificacionBufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.calificacionesBufete}/bufete/${bufeteId}`
        );
    }

    createCalificacion(
        bufeteId: number,
        data: CreateCalificacionBufeteRequest
    ): Observable<CalificacionBufete> {
        return this.http.post<CalificacionBufete>(
            `${this.baseUrl}${API_CONFIG.endpoints.calificacionesBufete}/bufete/${bufeteId}`,
            data
        );
    }

    /**
     * Obtener bufetes de un abogado
     */
    getByAbogadoId(abogadoId: string): Observable<Bufete[]> {
        return this.http.get<any>(`${this.baseUrl}/api/bufetes/abogado/${abogadoId}`).pipe(
            map(response => response.data || response)
        );
    }

    /**
     * Obtener abogados de un bufete
     */
    getAbogadosByBufete(bufeteId: number): Observable<Abogado[]> {
        return this.http.get<any>(`${this.baseUrl}/api/bufetes/${bufeteId}/abogados`).pipe(
            map(response => response.data || response)
        );
    }

    /**
     * Obtener abogados de un bufete por especialidad
     */
    getAbogadosPorEspecialidad(bufeteId: number, especialidadId: number): Observable<Abogado[]> {
        return this.http.get<any>(`${this.baseUrl}/api/bufetes/${bufeteId}/abogados/especialidad/${especialidadId}`).pipe(
            map(response => response.data || response)
        );
    }

    /**
     * Salir de un bufete
     */
    salirDeBufete(bufeteId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/bufetes/${bufeteId}/salir`);
    }
}