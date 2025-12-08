import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Especialidad } from '../models';

@Injectable({
    providedIn: 'root'
})
export class EspecialidadService {
    private baseUrl = API_CONFIG.baseUrl;

    constructor(private http: HttpClient) { }

    
    getAll(): Observable<Especialidad[]> {
        return this.http.get<Especialidad[]>(
            `${this.baseUrl}/api/especialidades`
        );
    }

    getById(id: number): Observable<Especialidad> {
        return this.http.get<Especialidad>(
            `${this.baseUrl}/api/especialidades/${id}`
        );
    }
}