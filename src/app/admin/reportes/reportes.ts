import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReporteState } from '../../state/reporte.state';
import { ReporteService } from '../../services/reporte.service';
import { Reporte, MotivoReporte } from '../../models';
import { ConsultaService } from '../../services/consulta.service';
import { RespuestaConsultaService } from '../../services/respuesta-consulta.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class Reportes implements OnInit {

  reportes$: Observable<Reporte[]>;
  isLoading$: Observable<boolean>;

  showModal = false;
  selectedReporte: Reporte | null = null;
  selectedConsulta: any = null;
  respuestas: any[] = [];

  constructor(
    private reporteState: ReporteState,
    private reporteService: ReporteService,
    private consultaService: ConsultaService,
    private respuestaService: RespuestaConsultaService
  ) {
    this.reportes$ = this.reporteState.reportes$;
    this.isLoading$ = this.reporteState.loading$;
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reporteState.setLoading(true);
    this.reporteService.getAll().subscribe({
      next: (reportes) => {
        this.reporteState.setReportes(reportes);
        this.reporteState.setLoading(false);
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.reporteState.setLoading(false);
      }
    });
  }

  viewConsultation(consultaId: number): void {
    if (!consultaId) return;

    
    this.consultaService.getById(consultaId).subscribe({
      next: (consulta) => {
        this.selectedConsulta = consulta;
        this.showModal = true;
        this.loadRespuestas(consultaId);
      },
      error: (err) => {
        console.error('Error al cargar consulta:', err);
        alert('No se pudieron cargar los detalles de la consulta.');
      }
    });
  }

  loadRespuestas(consultaId: number): void {
    this.respuestaService.getByConsultaId(consultaId).subscribe({
      next: (respuestas) => {
        this.respuestas = respuestas;
      },
      error: (err) => {
        console.error('Error al cargar respuestas:', err);
      }
    });
  }

  deleteReport(reportId: number | string, consultaId?: number | null): void {
    if (typeof reportId !== 'number') {
      alert('Error: El ID del reporte no es válido.');
      return;
    }

    if (!confirm('¿Seguro que deseas eliminar este reporte?')) {
      return;
    }

    this.reporteState.setLoading(true);
    this.reporteService.delete(reportId).subscribe({
      next: () => {
        this.reporteState.deleteReporte(reportId);
        this.reporteState.setLoading(false);
        alert('Reporte eliminado correctamente.');
      },
      error: (err) => {
        console.error('Error al eliminar reporte:', err);
        this.reporteState.setLoading(false);
        alert('Error al eliminar el reporte.');
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedConsulta = null;
    this.respuestas = [];
  }

  getReportId(report: Reporte): number | string {
    return report.id || 'N/A';
  }

  getFechaReporte(report: Reporte): string {
    const fechaRaw = report.fechaReporte;
    return fechaRaw
      ? new Date(fechaRaw).toLocaleDateString('es-ES')
      : 'No disponible';
  }

  getConsultaId(report: Reporte): number | null {
    return report.consultaId || null;
  }

  trackByReportId(index: number, report: Reporte): number | string {
    return report.id || index;
  }

  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}