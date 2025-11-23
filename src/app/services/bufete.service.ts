import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
    Bufete,
    CreateBufeteRequest,
    SolicitudBufete,
    CreateSolicitudBufeteRequest,
    UpdateSolicitudEstadoRequest,
    CalificacionBufete,
    CreateCalificacionBufeteRequest
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

}