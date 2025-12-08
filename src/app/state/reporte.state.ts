import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reporte, MotivoReporte } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ReporteState {
    private reportesSubject = new BehaviorSubject<Reporte[]>([]);
    public reportes$: Observable<Reporte[]> = this.reportesSubject.asObservable();

    private misReportesSubject = new BehaviorSubject<Reporte[]>([]);
    public misReportes$: Observable<Reporte[]> = this.misReportesSubject.asObservable();

    private reportesContraMiSubject = new BehaviorSubject<Reporte[]>([]);
    public reportesContraMi$: Observable<Reporte[]> = this.reportesContraMiSubject.asObservable();

    private motivosReporteSubject = new BehaviorSubject<MotivoReporte[]>([]);
    public motivosReporte$: Observable<MotivoReporte[]> = this.motivosReporteSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

   
    get reportes(): Reporte[] {
        return this.reportesSubject.value;
    }

   
    get misReportes(): Reporte[] {
        return this.misReportesSubject.value;
    }

   
    get reportesContraMi(): Reporte[] {
        return this.reportesContraMiSubject.value;
    }

   
    get motivosReporte(): MotivoReporte[] {
        return this.motivosReporteSubject.value;
    }

   
    setReportes(reportes: Reporte[]): void {
        this.reportesSubject.next(reportes);
    }

   
    setMisReportes(reportes: Reporte[]): void {
        this.misReportesSubject.next(reportes);
    }

  
    setReportesContraMi(reportes: Reporte[]): void {
        this.reportesContraMiSubject.next(reportes);
    }

   
    setMotivosReporte(motivos: MotivoReporte[]): void {
        this.motivosReporteSubject.next(motivos);
    }

    
    addReporte(reporte: Reporte): void {
        const reportes = [reporte, ...this.reportesSubject.value];
        this.reportesSubject.next(reportes);

        const misReportes = [reporte, ...this.misReportesSubject.value];
        this.misReportesSubject.next(misReportes);
    }

   
    deleteReporte(reporteId: number): void {
        const reportes = this.reportesSubject.value.filter(r => r.id !== reporteId);
        this.reportesSubject.next(reportes);

        const misReportes = this.misReportesSubject.value.filter(r => r.id !== reporteId);
        this.misReportesSubject.next(misReportes);

        const reportesContraMi = this.reportesContraMiSubject.value.filter(r => r.id !== reporteId);
        this.reportesContraMiSubject.next(reportesContraMi);
    }

    
    findReporteById(id: number): Reporte | undefined {
        return this.reportes.find(r => r.id === id);
    }

   
    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

   
    clear(): void {
        this.reportesSubject.next([]);
        this.misReportesSubject.next([]);
        this.reportesContraMiSubject.next([]);
        this.motivosReporteSubject.next([]);
        this.loadingSubject.next(false);
    }
}