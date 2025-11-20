import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription, of } from 'rxjs'; 
import { delay } from 'rxjs/operators';

interface Consulta {
  idConsulta: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  idUsuario: number;
  idMateria: number;
  municipio: string;
  estado: string;
  estatus: string;
  usuario?: { nombre: string; };
  materia?: { nombre: string; };
}

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './foro.html',
  styleUrls: ['./foro.css']
})
export class Foro implements OnInit, OnDestroy {

  consultas: Consulta[] = [];
  isLoading: boolean = true;
  errorMensaje: string | null = null;

  materiaDropdownAbierto: boolean = false;
  estadoDropdownAbierto: boolean = false;
  ciudadDropdownAbierto: boolean = false;

  materiaActiva: string | null = null;
  estadoActivo: string | null = null;
  ciudadActiva: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarConsultasSimuladas();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarConsultasSimuladas(): void {
    this.isLoading = true;
    this.errorMensaje = null;
    this.consultas = [];

    const datosFalsos: Consulta[] = [
      {
        idConsulta: 101,
        titulo: "Problema con testamento familiar",
        descripcion: "Mi abuelo falleció y no dejó testamento claro. Mis tíos quieren quedarse con la casa pero mi padre vivió ahí 20 años. ¿Qué podemos hacer? La propiedad está ubicada en el centro de la ciudad y no tenemos escrituras actualizadas.",
        fecha: new Date().toISOString(),
        idUsuario: 5,
        idMateria: 2,
        municipio: "Tuxtla Gutiérrez",
        estado: "Chiapas",
        estatus: "pendiente",
        usuario: { nombre: "María González" },
        materia: { nombre: "Derecho Civil" }
      },
      {
        idConsulta: 102,
        titulo: "Despido injustificado sin liquidación",
        descripcion: "Llevo 5 años en la empresa y me despidieron ayer sin darme ningún documento. Solo me dijeron que ya no regrese. ¿Cómo calculo mi liquidación? Ganaba $12,000 mensuales mas prestaciones de ley.",
        fecha: new Date(Date.now() - 86400000).toISOString(),
        idUsuario: 8,
        idMateria: 4,
        municipio: "Tapachula",
        estado: "Chiapas",
        estatus: "abierta",
        usuario: { nombre: "Carlos Ruiz" },
        materia: { nombre: "Derecho Laboral" }
      },
      {
        idConsulta: 103,
        titulo: "Divorcio express y custodia",
        descripcion: "Quiero tramitar mi divorcio pero mi pareja no quiere firmar y amenaza con quitarme a los niños. Necesito asesoría urgente sobre los pasos a seguir para proteger a mis hijos durante el proceso.",
        fecha: new Date(Date.now() - 172800000).toISOString(),
        idUsuario: 12,
        idMateria: 2,
        municipio: "San Cristóbal",
        estado: "Chiapas",
        estatus: "pendiente",
        usuario: { nombre: "Ana López" },
        materia: { nombre: "Derecho Familiar" }
      },
      {
        idConsulta: 104,
        titulo: "Incumplimiento de contrato mercantil",
        descripcion: "Un proveedor no entregó la mercancía pagada hace un mes. Tengo facturas y correos confirmando el pedido. El monto asciende a $50,000 pesos. ¿Procede una demanda mercantil inmediata?",
        fecha: new Date(Date.now() - 250000000).toISOString(),
        idUsuario: 20,
        idMateria: 5,
        municipio: "Comitán",
        estado: "Chiapas",
        estatus: "abierta",
        usuario: { nombre: "Empresa XYZ" },
        materia: { nombre: "Derecho Mercantil" }
      }
    ];

    const mockSub = of(datosFalsos)
      .pipe(delay(600))
      .subscribe(data => {
        this.consultas = data;
        this.isLoading = false;
      });

    this.subscriptions.add(mockSub);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/abogado/consultas'], { queryParams: { id: id } });
  }

  toggleDropdown(tipo: 'materia' | 'estado' | 'ciudad'): void {
    if (tipo === 'materia') {
      this.materiaDropdownAbierto = !this.materiaDropdownAbierto;
      this.estadoDropdownAbierto = false;
      this.ciudadDropdownAbierto = false;
    } else if (tipo === 'estado') {
      this.estadoDropdownAbierto = !this.estadoDropdownAbierto;
      this.materiaDropdownAbierto = false;
      this.ciudadDropdownAbierto = false;
    } else if (tipo === 'ciudad') {
      this.ciudadDropdownAbierto = !this.ciudadDropdownAbierto;
      this.materiaDropdownAbierto = false;
      this.estadoDropdownAbierto = false;
    }
  }

  seleccionarFiltro(tipo: 'materia' | 'estado' | 'ciudad', valor: string): void {
    if (tipo === 'materia') this.materiaActiva = valor;
    if (tipo === 'estado') this.estadoActivo = valor;
    if (tipo === 'ciudad') this.ciudadActiva = valor;

    this.materiaDropdownAbierto = false;
    this.estadoDropdownAbierto = false;
    this.ciudadDropdownAbierto = false;

    this.cargarConsultasSimuladas();
  }

  limpiarFiltros(): void {
    this.materiaActiva = null;
    this.estadoActivo = null;
    this.ciudadActiva = null;
    this.cargarConsultasSimuladas();
  }

  formatTime(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES');
  }
}