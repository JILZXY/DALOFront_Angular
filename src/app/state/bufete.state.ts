import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bufete, SolicitudBufete, EstadoSolicitud, Abogado } from '../models';
import { BufeteService } from '../services/bufete.service';
import { SolicitudBufeteService } from '../services/solicitud-bufete.service';

@Injectable({
    providedIn: 'root'
})
export class BufeteState {
    private bufetesSubject = new BehaviorSubject<Bufete[]>([]);
    public bufetes$: Observable<Bufete[]> = this.bufetesSubject.asObservable();

    private misBufetesSubject = new BehaviorSubject<Bufete[]>([]);
    public misBufetes$: Observable<Bufete[]> = this.misBufetesSubject.asObservable();

    private bufeteActualSubject = new BehaviorSubject<Bufete | null>(null);
    public bufeteActual$: Observable<Bufete | null> = this.bufeteActualSubject.asObservable();

    private solicitudesSubject = new BehaviorSubject<SolicitudBufete[]>([]);
    public solicitudes$: Observable<SolicitudBufete[]> = this.solicitudesSubject.asObservable();

    private abogadosFiltradosSubject = new BehaviorSubject<Abogado[]>([]);
    public abogadosFiltrados$: Observable<Abogado[]> = this.abogadosFiltradosSubject.asObservable();

   
    get bufetes(): Bufete[] {
        return this.bufetesSubject.value;
    }

   
    get misBufetes(): Bufete[] {
        return this.misBufetesSubject.value;
    }

   
    get bufeteActual(): Bufete | null {
        return this.bufeteActualSubject.value;
    }

    
    setBufetes(bufetes: Bufete[]): void {
        this.bufetesSubject.next(bufetes);
    }

    
    setMisBufetes(bufetes: Bufete[]): void {
        this.misBufetesSubject.next(bufetes);
    }

    
    setBufeteActual(bufete: Bufete | null): void {
        this.bufeteActualSubject.next(bufete);
    }

   
    setSolicitudes(solicitudes: SolicitudBufete[]): void {
        this.solicitudesSubject.next(solicitudes);
    }

    
    setAbogadosFiltrados(abogados: Abogado[]): void {
        this.abogadosFiltradosSubject.next(abogados);
    }

    get abogadosFiltrados(): Abogado[] {
        return this.abogadosFiltradosSubject.value;
    }

   
    addBufete(bufete: Bufete): void {
        const bufetes = [bufete, ...this.bufetesSubject.value];
        this.bufetesSubject.next(bufetes);

        const misBufetes = [bufete, ...this.misBufetesSubject.value];
        this.misBufetesSubject.next(misBufetes);
    }

    updateBufete(bufeteActualizado: Bufete): void {
        const bufetes = this.bufetesSubject.value.map(b =>
            b.id === bufeteActualizado.id ? bufeteActualizado : b
        );
        this.bufetesSubject.next(bufetes);

        const misBufetes = this.misBufetesSubject.value.map(b =>
            b.id === bufeteActualizado.id ? bufeteActualizado : b
        );
        this.misBufetesSubject.next(misBufetes);
    }

   
    deleteBufete(bufeteId: number): void {
        const bufetes = this.bufetesSubject.value.filter(b => b.id !== bufeteId);
        this.bufetesSubject.next(bufetes);

        const misBufetes = this.misBufetesSubject.value.filter(b => b.id !== bufeteId);
        this.misBufetesSubject.next(misBufetes);
    }

    
    deleteBufeteServer(bufeteId: number): Observable<void> {
        return this.bufeteService.delete(bufeteId);
    }

    
    constructor(
        private bufeteService: BufeteService,
        private solicitudService: SolicitudBufeteService
    ) {}


    loadBufetes(): void {
        this.bufeteService.getAll().subscribe(bufetes => {
            this.setBufetes(bufetes);
        });
    }

    createBufete(data: any): Observable<Bufete> {
        const obs = this.bufeteService.create(data);
        obs.subscribe(bufete => {
            this.addBufete(bufete);
            this.setBufeteActual(bufete);
        });
        return obs;
    }

    unirseBufete(bufeteId: number): Observable<SolicitudBufete> {
        return this.solicitudService.create({ bufeteId });
    }

    getAbogadosPorEspecialidad(bufeteId: number, especialidadId: number): void {
        this.bufeteService.getAbogadosPorEspecialidad(bufeteId, especialidadId).subscribe({
            next: (abogados) => {
                this.setAbogadosFiltrados(abogados);
            },
            error: (error) => {
                console.error('Error al filtrar abogados:', error);
                this.setAbogadosFiltrados([]);
            }
        });
    }

    salirDeBufete(bufeteId: number): Observable<any> {
        const obs = this.bufeteService.salirDeBufete(bufeteId);
        obs.subscribe(() => {
            this.setBufeteActual(null);
            this.loadMisBufetes(); 
        });
        return obs;
    }

    loadMisBufetes(): Observable<Bufete[]> {
        const obs = this.bufeteService.getMisBufetes();
        obs.subscribe(bufetes => {
            this.setMisBufetes(bufetes);
            if (bufetes.length > 0) {
                this.setBufeteActual(bufetes[0]);
                this.loadSolicitudes(bufetes[0].id);
            }
        });
        return obs;
    }

    loadSolicitudes(bufeteId: number): void {
        this.solicitudService.getByBufeteId(bufeteId).subscribe(solicitudes => {
            this.setSolicitudes(solicitudes);
        });
    }

    aprobarSolicitud(solicitudId: number): Observable<void> {
        return this.updateSolicitudEstado(solicitudId, EstadoSolicitud.APROBADO);
    }

    rechazarSolicitud(solicitudId: number): Observable<void> {
        return this.updateSolicitudEstado(solicitudId, EstadoSolicitud.RECHAZADO);
    }

    private updateSolicitudEstado(solicitudId: number, estado: string): Observable<void> {
        const obs = this.solicitudService.updateEstado(solicitudId, { estado });
        obs.subscribe(() => {
             const current = this.solicitudesSubject.value;
             this.setSolicitudes(current.filter(s => s.id !== solicitudId));
        });
        return obs;
    }

    clear(): void {
        this.bufetesSubject.next([]);
        this.misBufetesSubject.next([]);
        this.bufeteActualSubject.next(null);
        this.solicitudesSubject.next([]);
        this.abogadosFiltradosSubject.next([]);
    }
}