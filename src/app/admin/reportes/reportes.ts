import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Reporte {
  idReporte?: number;
  id?: number;
  idConsulta?: number;
  consultaId?: number;
  fechaReporte?: string;
  fecha?: string;
  fecha_reporte?: string;
  activo?: boolean;
}

interface Consulta {
  idConsulta?: number;
  id?: number;
  idUsuario?: number;
  usuarioId?: number;
  pregunta?: string;
  question?: string;
  titulo?: string;
  title?: string;
  fechaPublicacion?: string;
  fechaCreacion?: string;
}

interface Respuesta {
  idRespuesta?: number;
  id?: number;
  respuesta?: string;
  texto?: string;
  fechaRespuesta?: string;
  fecha?: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class Reportes implements OnInit {
  
  private mockReportes: Reporte[] = [
    { idReporte: 1, idConsulta: 101, fechaReporte: '2023-10-27T10:00:00Z', activo: true },
    { idReporte: 2, idConsulta: 102, fechaReporte: '2023-10-26T15:30:00Z', activo: true },
  ];

  private mockConsultas: { [key: number]: Consulta } = {
    101: { idConsulta: 101, idUsuario: 1, titulo: 'Problema con contrato de alquiler', pregunta: 'Mi arrendador no quiere devolverme la fianza y no sé qué hacer. El contrato ya terminó.', fechaCreacion: '2023-10-25T09:00:00Z' },
    102: { idConsulta: 102, idUsuario: 2, titulo: 'Duda sobre despido laboral', pregunta: 'Me han despedido sin previo aviso y creo que es injustificado. ¿Cuáles son mis derechos?', fechaCreacion: '2023-10-24T18:00:00Z' },
  };

  private mockRespuestas: { [key: number]: Respuesta[] } = {
    101: [
      { idRespuesta: 201, texto: 'Deberías enviar un burofax reclamando la fianza. Es el primer paso formal.', fecha: '2023-10-25T11:00:00Z' },
      { idRespuesta: 202, texto: 'Revisa si el contrato especifica algo sobre la devolución de la fianza y si dejaste el piso en buenas condiciones.', fecha: '2023-10-25T12:00:00Z' }
    ],
    102: [
      { idRespuesta: 203, texto: 'Si fue un despido improcedente, tienes derecho a una indemnización. Tienes 20 días hábiles para impugnarlo.', fecha: '2023-10-25T08:00:00Z' }
    ]
  };

  reportes: Reporte[] = [];
  isLoading = false;
  showNoData = false;

  showModal = false;
  selectedConsulta: Consulta | null = null;
  respuestas: Respuesta[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.reportes = [...this.mockReportes];
      this.showNoData = this.reportes.length === 0;
      this.isLoading = false;
    }, 500);
  }

  viewConsultation(consultaId: number): void {
    const consulta = this.mockConsultas[consultaId];
    const respuestas = this.mockRespuestas[consultaId] || [];

    if (consulta) {
      this.selectedConsulta = consulta;
      this.respuestas = respuestas;
      this.showModal = true;
    } else {
      console.error('No se encontraron detalles para la consulta:', consultaId);
      alert('Error: No se pudieron cargar los detalles de la consulta.');
    }
  }

  deleteReport(reportId: number | string, consultaId: number | null): void {
    if (typeof reportId !== 'number') {
      alert('Error: El ID del reporte no es válido y no se puede eliminar.');
      return;
    }

    if (!confirm('¿Seguro que deseas eliminar este reporte y su consulta asociada? Esta acción no se puede deshacer.')) {
      return;
    }

    const reportIndex = this.reportes.findIndex(r => this.getReportId(r) === reportId);
    if (reportIndex > -1) {
      this.reportes.splice(reportIndex, 1);
    }

    if (consultaId) {
      const mockReportIndex = this.mockReportes.findIndex(r => (r.idReporte || r.id) === reportId);
      if (mockReportIndex > -1) {
        this.mockReportes.splice(mockReportIndex, 1);
      }
      delete this.mockConsultas[consultaId];
      delete this.mockRespuestas[consultaId];
    }

    alert('Reporte y consulta eliminados correctamente.');

    if (this.reportes.length === 0) {
      this.showNoData = true;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedConsulta = null;
    this.respuestas = [];
  }

  getReportId(report: Reporte): number | string {
    return report.idReporte || report.id || 'N/A';
  }

  getConsultaId(report: Reporte): number | null {
    return report.idConsulta || report.consultaId || null;
  }

  getFechaReporte(report: Reporte): string {
    const fechaRaw = report.fechaReporte || report.fecha || report.fecha_reporte;
    return fechaRaw 
      ? new Date(fechaRaw).toLocaleDateString('es-ES')
      : 'No disponible';
  }

  isReportActive(report: Reporte): boolean {
    return report.activo !== undefined ? report.activo : true;
  }

  getConsultaInfo(key: 'id' | 'userId' | 'pregunta' | 'titulo' | 'fecha'): string {
    if (!this.selectedConsulta) return 'N/A';

    switch(key) {
      case 'id':
        return String(this.selectedConsulta.idConsulta || this.selectedConsulta.id || 'N/A');
      case 'userId':
        return String(this.selectedConsulta.idUsuario || this.selectedConsulta.usuarioId || 'N/A');
      case 'pregunta':
        return this.selectedConsulta.pregunta || this.selectedConsulta.question || 'No disponible';
      case 'titulo':
        return this.selectedConsulta.titulo || this.selectedConsulta.title || 'No disponible';
      case 'fecha':
        const fechaRaw = this.selectedConsulta.fechaPublicacion || this.selectedConsulta.fechaCreacion;
        return fechaRaw ? new Date(fechaRaw).toLocaleString('es-ES') : 'No disponible';
      default:
        return 'N/A';
    }
  }

  getRespuestaInfo(respuesta: Respuesta, key: 'id' | 'texto' | 'fecha'): string {
    switch(key) {
      case 'id':
        return String(respuesta.idRespuesta || respuesta.id || 'N/A');
      case 'texto':
        return respuesta.respuesta || respuesta.texto || 'No disponible';
      case 'fecha':
        const fechaRaw = respuesta.fechaRespuesta || respuesta.fecha;
        return fechaRaw ? new Date(fechaRaw).toLocaleString('es-ES') : 'No disponible';
      default:
        return 'N/A';
    }
  }

  trackByReportId(index: number, report: Reporte): number | string {
    return this.getReportId(report);
  }

  trackByRespuestaId(index: number, respuesta: Respuesta): number | string {
    return respuesta.idRespuesta || respuesta.id || index;
  }

  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}