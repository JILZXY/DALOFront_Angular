import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Abogado } from '../models';
import { AbogadoService } from '../services/abogado.service';

@Injectable({
    providedIn: 'root'
})
export class AbogadoState {
    private abogadosSubject = new BehaviorSubject<Abogado[]>([]);
    public abogados$: Observable<Abogado[]> = this.abogadosSubject.asObservable();

    private abogadoActualSubject = new BehaviorSubject<Abogado | null>(null);
    public abogadoActual$: Observable<Abogado | null> = this.abogadoActualSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor(private abogadoService: AbogadoService) {}

    
    get abogados(): Abogado[] {
        return this.abogadosSubject.value;
    }

    get abogadoActual(): Abogado | null {
        return this.abogadoActualSubject.value;
    }

    setAbogados(abogados: Abogado[]): void {
        this.abogadosSubject.next(abogados);
    }

   
    setAbogadoActual(abogado: Abogado | null): void {
        this.abogadoActualSubject.next(abogado);
    }

    
    findAbogadoById(id: string): Abogado | undefined {
        return this.abogados.find(a => a.idAbogado === id);
    }

   
    updateAbogado(abogadoActualizado: Abogado): void {
        const abogados = this.abogadosSubject.value.map(a =>
            a.idAbogado === abogadoActualizado.idAbogado ? abogadoActualizado : a
        );
        this.abogadosSubject.next(abogados);

        if (this.abogadoActual?.idAbogado === abogadoActualizado.idAbogado) {
            this.abogadoActualSubject.next(abogadoActualizado);
        }
    }

  
    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    
    clear(): void {
        this.abogadosSubject.next([]);
        this.abogadoActualSubject.next(null);
        this.loadingSubject.next(false);
    }


    loadByEspecialidad(id: number): void {
        this.setLoading(true);
        this.abogadoService.getAbogadosByEspecialidadOnly(id).subscribe({
            next: (data) => {
                this.setAbogados(data);
                this.setLoading(false);
            },
            error: (error) => {
                console.error('Error loading lawyers by specialty', error);
                this.setLoading(false);
            }
        });
    }

    loadByMunicipio(id: number): void {
        this.setLoading(true);
        this.abogadoService.getAbogadosByMunicipioOnly(id).subscribe({
            next: (data) => {
                this.setAbogados(data);
                this.setLoading(false);
            },
            error: (error) => {
                console.error('Error loading lawyers by municipality', error);
                this.setLoading(false);
            }
        });
    }

    loadByEstado(id: number): void {
        this.setLoading(true);
        this.abogadoService.getAbogadosByEstadoOnly(id).subscribe({
            next: (data) => {
                this.setAbogados(data);
                this.setLoading(false);
            },
            error: (error) => {
                console.error('Error loading lawyers by state', error);
                this.setLoading(false);
            }
        });
    }
}