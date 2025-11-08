import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { Subscription, of } from 'rxjs'; 
import { delay } from 'rxjs/operators';

interface Abogado {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  estado: string;
  ciudad: string;
  especialidades: string[]; 
  calificacion: number;
  foto: string;
  email: string;
}

@Component({
  selector: 'app-contactar-abogado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactar-abogado.html',
  styleUrls: ['./contactar-abogado.css']
})
export class ContactarAbogado implements OnInit, OnDestroy { 

  abogados: Abogado[] = [];
  isLoading: boolean = true;
  errorMensaje: string = '';

  materiaDropdownAbierto: boolean = false;
  estadoDropdownAbierto: boolean = false;
  ciudadDropdownAbierto: boolean = false;
  
  materiaActiva: string | null = null;
  estadoActivo: string | null = null;
  ciudadActiva: string | null = null;
  terminoBusqueda: string = '';
  
  private baseUrl = 'http://52.3.15.55:7000/usuarios';
  
  private cargaSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarAbogadosSimulados();
  }

  ngOnDestroy(): void {
    if (this.cargaSubscription) {
      this.cargaSubscription.unsubscribe();
    }
  }

  cargarAbogados(url: string): void {
    this.cargarAbogadosSimulados();
  }

  cargarAbogadosSimulados(): void {
    this.isLoading = true;
    this.errorMensaje = '';
    this.abogados = [];
    this.cerrarDropdowns();

    if (this.cargaSubscription) {
      this.cargaSubscription.unsubscribe();
    }

    const abogadosFalsos: Abogado[] = [
      {
        idUsuario: 101,
        nombre: 'Lic. Roberto',
        apellidos: 'Gómez Bolaños',
        estado: 'Chiapas',
        ciudad: 'Tuxtla Gutiérrez',
        especialidades: ['Derecho Penal', 'Derecho Civil'],
        calificacion: 4.8,
        foto: '', 
        email: 'roberto@ejemplo.com'
      },
      {
        idUsuario: 102,
        nombre: 'Lic. Ana',
        apellidos: 'Martínez',
        estado: 'Chiapas',
        ciudad: 'Tapachula',
        especialidades: ['Derecho Laboral'],
        calificacion: 5.0,
        foto: '',
        email: 'ana@ejemplo.com'
      },
      {
        idUsuario: 103,
        nombre: 'Lic. Carlos',
        apellidos: 'Salinas',
        estado: 'Chiapas',
        ciudad: 'San Cristóbal',
        especialidades: ['Derecho Mercantil', 'Derecho Fiscal'],
        calificacion: 3.5,
        foto: '',
        email: 'carlos@ejemplo.com'
      },
      {
        idUsuario: 104,
        nombre: 'Lic. Sofía',
        apellidos: 'Vergara',
        estado: 'Chiapas',
        ciudad: 'Comitán',
        especialidades: ['Derecho Familiar'],
        calificacion: 4.2,
        foto: '',
        email: 'sofia@ejemplo.com'
      }
    ];

    this.cargaSubscription = of(abogadosFalsos)
      .pipe(delay(800)) 
      .subscribe({
        next: (data) => {
          this.abogados = data;
          if (this.abogados.length === 0) {
            this.errorMensaje = 'No se encontraron abogados con esos criterios.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMensaje = 'Error al cargar los abogados simulados.';
          this.isLoading = false;
        }
      });
  }

  toggleDropdown(dropdown: 'materia' | 'estado' | 'ciudad'): void {
    this.materiaDropdownAbierto = (dropdown === 'materia') ? !this.materiaDropdownAbierto : false;
    this.estadoDropdownAbierto = (dropdown === 'estado') ? !this.estadoDropdownAbierto : false;
    this.ciudadDropdownAbierto = (dropdown === 'ciudad') ? !this.ciudadDropdownAbierto : false;
  }
  
  cerrarDropdowns(): void {
    this.materiaDropdownAbierto = false;
    this.estadoDropdownAbierto = false;
    this.ciudadDropdownAbierto = false;
  }

  filtrarPorMateria(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.materiaActiva = input.value;
    this.cargarAbogadosSimulados();
  }
  
  filtrarPorEstado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.estadoActivo = input.value;
    this.cargarAbogadosSimulados();
  }

  filtrarPorCiudad(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.ciudadActiva = input.value;
    this.cargarAbogadosSimulados();
  }
  
  limpiarFiltros(): void {
    this.materiaActiva = null;
    this.estadoActivo = null;
    this.ciudadActiva = null;
    this.terminoBusqueda = '';
    this.cargarAbogadosSimulados();
  }

  buscarPorNombre(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.limpiarFiltros();
      return;
    }
    this.cargarAbogadosSimulados();
  }
  
  contactarAbogado(abogado: Abogado): void {
    if (abogado.email) {
      window.location.href = `mailto:${abogado.email}?subject=Contacto desde DALO`;
    } else {
      this.errorMensaje = 'Este abogado no ha proporcionado un correo electrónico público.';
      setTimeout(() => { this.errorMensaje = ''; }, 3000);
    }
  }
}