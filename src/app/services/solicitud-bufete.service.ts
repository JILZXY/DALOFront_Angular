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

    create(data: CreateSolicitudBufeteRequest): Observable<SolicitudBufete> {
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


    getByBufeteId(bufeteId: number): Observable<SolicitudBufete[]> {
        return this.http.get<SolicitudBufete[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/bufete/${bufeteId}`
        );
    }

   
    updateEstado(id: number, data: UpdateSolicitudEstadoRequest): Observable<void> {
        return this.http.patch<void>(
            `${this.baseUrl}${API_CONFIG.endpoints.solicitudesBufete}/${id}`,
            data
        );
    }

    
    aprobar(solicitudId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/solicitudes-bufete/${solicitudId}/aprobar`, {});
    }

    rechazar(solicitudId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/solicitudes-bufete/${solicitudId}/rechazar`, {});
    }
}