import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
    SolicitudBufete,
    CreateSolicitudBufeteRequest,
    UpdateSolicitudEstadoRequest
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class SolicitudBufeteService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Crear solicitud para unirse a un bufete (Abogado)
     * POST /api/solicitudes-bufete
     */
    create(data: CreateSolicitudBufeteRequest): Observable<SolicitudBufete> {
        return this.http.post<SolicitudBufete>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}`,
            data
        );
    }

    /**
     * Obtener mis solicitudes enviadas (Abogado)
     * GET /api/solicitudes-bufete/mis-solicitudes
     */
    getMisSolicitudes(): Observable<SolicitudBufete[]> {
        return this.http.get<SolicitudBufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/mis-solicitudes`
        );
    }

    /**
     * Obtener solicitudes de un bufete (Dueño del bufete)
     * GET /api/solicitudes-bufete/bufete/{bufeteId}
     */
    getByBufeteId(bufeteId: number): Observable<SolicitudBufete[]> {
        return this.http.get<SolicitudBufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/bufete/${bufeteId}`
        );
    }

    /**
     * Aprobar o rechazar solicitud (Dueño del bufete)
     * PATCH /api/solicitudes-bufete/{id}
     */
    updateEstado(id: number, data: UpdateSolicitudEstadoRequest): Observable<void> {
        return this.http.patch<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/${id}`,
            data
        );
    }

    /**
     * Aprobar solicitud
     */
    aprobar(solicitudId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/solicitudes-bufete/${solicitudId}/aprobar`, {});
    }

    /**
     * Rechazar solicitud
     */
    rechazar(solicitudId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/solicitudes-bufete/${solicitudId}/rechazar`, {});
    }
}