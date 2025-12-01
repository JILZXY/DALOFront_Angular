import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reporte, MotivoReporte } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ReporteState {
    // Todos los reportes (para admin)
    private reportesSubject = new BehaviorSubject<Reporte[]>([]);
    public reportes$: Observable<Reporte[]> = this.reportesSubject.asObservable();

    // Mis reportes realizados
    private misReportesSubject = new BehaviorSubject<Reporte[]>([]);
    public misReportes$: Observable<Reporte[]> = this.misReportesSubject.asObservable();

    // Reportes en mi contra
    private reportesContraMiSubject = new BehaviorSubject<Reporte[]>([]);
    public reportesContraMi$: Observable<Reporte[]> = this.reportesContraMiSubject.asObservable();

    // Catálogo de motivos de reporte
    private motivosReporteSubject = new BehaviorSubject<MotivoReporte[]>([]);
    public motivosReporte$: Observable<MotivoReporte[]> = this.motivosReporteSubject.asObservable();

    // Estado de carga
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    /**
     * Obtener reportes (valor instantáneo)
     */
    get reportes(): Reporte[] {
        return this.reportesSubject.value;
    }

    /**
     * Obtener mis reportes (valor instantáneo)
     */
    get misReportes(): Reporte[] {
        return this.misReportesSubject.value;
    }

    /**
     * Obtener reportes contra mí (valor instantáneo)
     */
    get reportesContraMi(): Reporte[] {
        return this.reportesContraMiSubject.value;
    }

    /**
     * Obtener motivos de reporte (valor instantáneo)
     */
    get motivosReporte(): MotivoReporte[] {
        return this.motivosReporteSubject.value;
    }

    /**
     * Establecer todos los reportes
     */
    setReportes(reportes: Reporte[]): void {
        this.reportesSubject.next(reportes);
    }

    /**
     * Establecer mis reportes
     */
    setMisReportes(reportes: Reporte[]): void {
        this.misReportesSubject.next(reportes);
    }

    /**
     * Establecer reportes contra mí
     */
    setReportesContraMi(reportes: Reporte[]): void {
        this.reportesContraMiSubject.next(reportes);
    }

    /**
     * Establecer motivos de reporte
     */
    setMotivosReporte(motivos: MotivoReporte[]): void {
        this.motivosReporteSubject.next(motivos);
    }

    /**
     * Agregar un nuevo reporte
     */
    addReporte(reporte: Reporte): void {
        const reportes = [reporte, ...this.reportesSubject.value];
        this.reportesSubject.next(reportes);

        const misReportes = [reporte, ...this.misReportesSubject.value];
        this.misReportesSubject.next(misReportes);
    }

    /**
     * Eliminar un reporte
     */
    deleteReporte(reporteId: number): void {
        // Eliminar de todos los reportes
        const reportes = this.reportesSubject.value.filter(r => r.id !== reporteId);
        this.reportesSubject.next(reportes);

        // Eliminar de mis reportes
        const misReportes = this.misReportesSubject.value.filter(r => r.id !== reporteId);
        this.misReportesSubject.next(misReportes);

        // Eliminar de reportes contra mí
        const reportesContraMi = this.reportesContraMiSubject.value.filter(r => r.id !== reporteId);
        this.reportesContraMiSubject.next(reportesContraMi);
    }

    /**
     * Buscar reporte por ID
     */
    findReporteById(id: number): Reporte | undefined {
        return this.reportes.find(r => r.id === id);
    }

    /**
     * Establecer estado de carga
     */
    setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    /**
     * Limpiar todo el estado
     */
    clear(): void {
        this.reportesSubject.next([]);
        this.misReportesSubject.next([]);
        this.reportesContraMiSubject.next([]);
        this.motivosReporteSubject.next([]);
        this.loadingSubject.next(false);
    }
}