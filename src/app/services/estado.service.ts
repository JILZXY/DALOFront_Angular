import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Estado, Municipio, Especialidad } from '../models';

@Injectable({
    providedIn: 'root'
})
export class EstadoService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }


    getAllEstados(): Observable<Estado[]> {
        return this.http.get<Estado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.estados}`
        );
    }


    getEstadoById(id: number): Observable<Estado> {
        return this.http.get<Estado>(
            `${this.baseUrl}${API_CONFIG.endpoints.estados}/${id}`
        );
    }


    getAllMunicipios(estadoId?: number): Observable<Municipio[]> {
        let params = new HttpParams();
        if (estadoId) {
            params = params.set('estadoId', estadoId.toString());
        }

        return this.http.get<Municipio[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.municipios}`,
            { params }
        );
    }

    getMunicipioById(id: number): Observable<Municipio> {
        return this.http.get<Municipio>(
            `${this.baseUrl}${API_CONFIG.endpoints.municipios}/${id}`
        );
    }

    getEspecialidades(): Observable<Especialidad[]> {
        return this.http.get<Especialidad[]>(
            `${this.baseUrl}/api/especialidades`
        );
    }
}