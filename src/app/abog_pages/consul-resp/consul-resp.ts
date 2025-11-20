import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription, of } from 'rxjs'; 
import { delay } from 'rxjs/operators';

interface Usuario {
  id: number;
  nombre: string;
}

interface Consulta {
  idConsulta: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  idUsuario: number;
  materia?: { nombre: string; }; 
  usuario?: { nombre: string; }; 
}

interface Respuesta {
  idRespuesta: number;
  contenido: string;
  fecha: string;
  abogado?: { nombre: string; apellidos: string; foto: string; };
  idUsuarioAbogado: number;
}

@Component({
  selector: 'app-consul-resp',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './consul-resp.html',
  styleUrls: ['./consul-resp.css']
})
export class ConsulResp implements OnInit, OnDestroy {

  consulta: Consulta | null = null;
  respuestas: Respuesta[] = [];
  isLoading: boolean = true;
  errorMensaje: string | null = null;
  
  currentUser: Usuario | null = null;
  private consultaId: number | null = null;
  
  nuevaRespuesta: string = '';
  enviandoRespuesta: boolean = false;
  errorRespuesta: string | null = null;

  isReportModalVisible: boolean = false;
  reportReason: string = '';
  customReason: string = '';
  enviandoReporte: boolean = false;
  errorReporte: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, 
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simulación de usuario logueado
    this.currentUser = { id: 2, nombre: 'Lic. Prueba' };

    const routeSub = this.route.queryParamMap.subscribe(params => {
      this.cargarDatosSimulados();
    });
    this.subscriptions.add(routeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarDatosSimulados(): void {
    this.isLoading = true;

    const consultaFalsa: Consulta = {
      idConsulta: 123,
      titulo: "Despido injustificado en periodo de prueba",
      descripcion: "Hola, llevo 2 meses trabajando y me despidieron sin justificación. Me dicen que por estar a prueba no me toca nada. ¿Es esto cierto? Firmé un contrato por 3 meses.",
      fecha: new Date().toISOString(), 
      idUsuario: 50,
      materia: { nombre: "Derecho Laboral" },
      usuario: { nombre: "Juan Pérez" }
    };

    const respuestasFalsas: Respuesta[] = [
      {
        idRespuesta: 1,
        contenido: "Estimado Juan, aunque estés en periodo de prueba, tienes derechos. Deben pagarte los días trabajados y la parte proporcional de aguinaldo y vacaciones.",
        fecha: new Date(Date.now() - 86400000).toISOString(), 
        abogado: { nombre: "Lic. Roberto", apellidos: "Gómez", foto: "" },
        idUsuarioAbogado: 99
      },
      {
        idRespuesta: 2,
        contenido: "Complementando lo anterior: revisa si tu contrato especifica las condiciones de prueba. Aún así, no pueden simplemente no pagarte nada.",
        fecha: new Date().toISOString(),
        abogado: { nombre: "Lic. Ana", apellidos: "Martínez", foto: "" },
        idUsuarioAbogado: 2 
      }
    ];

    const mockSub = of({ consulta: consultaFalsa, respuestas: respuestasFalsas })
      .pipe(delay(500))
      .subscribe(data => {
        this.consulta = data.consulta;
        this.respuestas = data.respuestas;
        this.isLoading = false; 
      });
      
    this.subscriptions.add(mockSub);
  }

  enviarRespuesta(): void {
    if (!this.nuevaRespuesta.trim()) return;
    this.enviandoRespuesta = true;
    
    setTimeout(() => {
      this.respuestas.push({
        idRespuesta: Math.random(),
        contenido: this.nuevaRespuesta,
        fecha: new Date().toISOString(),
        abogado: { nombre: "Lic. Prueba", apellidos: "(Tú)", foto: "" },
        idUsuarioAbogado: this.currentUser?.id || 0
      });
      this.nuevaRespuesta = '';
      this.enviandoRespuesta = false;
    }, 1000);
  }

  abrirModalReporte(): void {
    this.isReportModalVisible = true;
    this.reportReason = '';
    this.customReason = '';
  }

  cerrarModalReporte(): void {
    this.isReportModalVisible = false;
  }

  enviarReporte(): void {
    this.enviandoReporte = true;
    setTimeout(() => {
      alert('Reporte simulado enviado.');
      this.enviandoReporte = false;
      this.cerrarModalReporte();
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/abogado/foro']);
  }

  formatTime(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}