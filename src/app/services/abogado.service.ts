import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Abogado, Especialidad } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AbogadoService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }


    getAll(especialidadId?: number): Observable<Abogado[]> {
        let params = new HttpParams();
        if (especialidadId) {
            params = params.set('especialidadId', especialidadId.toString());
        }

        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}`,
            { params }
        );
    }


    getById(id: string): Observable<Abogado> {
        return this.http.get<Abogado>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/${id}`
        );
    }


    searchByName(nombre: string): Observable<Abogado[]> {
        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/buscar/${nombre}`
        );
    }

    getByMateria(materiaId: number): Observable<Abogado[]> {
        const params = new HttpParams().set('materiaId', materiaId.toString());

        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/materia`,
            { params }
        );
    }


    getByLocalidad(estadoId?: number, municipioId?: number): Observable<Abogado[]> {
        let params = new HttpParams();

        if (estadoId) {
            params = params.set('estadoId', estadoId.toString());
        }
        if (municipioId) {
            params = params.set('municipioId', municipioId.toString());
        }

        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/localidad`,
            { params }
        );
    }

    // New specific endpoints requested by user
    getAbogadosByEspecialidadOnly(especialidadId: number): Observable<Abogado[]> {
        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/especialidad/${especialidadId}`
        );
    }

    getAbogadosByMunicipioOnly(municipioId: number): Observable<Abogado[]> {
        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/municipio/${municipioId}`
        );
    }

    getAbogadosByEstadoOnly(estadoId: number): Observable<Abogado[]> {
        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/estado/${estadoId}`
        );
    }


    filtrar(filters: {
        materiaId?: number;
        estadoId?: number;
        municipioId?: number;
        ordenarPorCalificacion?: boolean;
    }): Observable<Abogado[]> {
        let params = new HttpParams();

        if (filters.materiaId) {
            params = params.set('materiaId', filters.materiaId.toString());
        }
        if (filters.estadoId) {
            params = params.set('estadoId', filters.estadoId.toString());
        }
        if (filters.municipioId) {
            params = params.set('municipioId', filters.municipioId.toString());
        }
        if (filters.ordenarPorCalificacion !== undefined) {
            params = params.set('ordenarPorCalificacion', filters.ordenarPorCalificacion.toString());
        }

        return this.http.get<Abogado[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogadosFiltro}`,
            { params }
        );
    }


    getEspecialidades(abogadoId: string): Observable<Especialidad[]> {
        return this.http.get<Especialidad[]>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/materias/${abogadoId}`
        );
    }


    update(id: string, data: Partial<Abogado>): Observable<Abogado> {
        return this.http.put<Abogado>(
            `${this.baseUrl}${API_CONFIG.endpoints.abogados}/${id}`,
            data
        );
    }
}