import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError, Subscription } from 'rxjs'; 

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

interface AbogadosResponse {
  abogados: Abogado[];
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
    this.cargarAbogados(`${this.baseUrl}/abogados`);
  }

  
  cargarAbogados(url: string): void {
    this.isLoading = true;
    this.errorMensaje = '';
    this.abogados = [];
    this.cerrarDropdowns();

    if (this.cargaSubscription) {
      this.cargaSubscription.unsubscribe();
    }

    this.cargaSubscription = this.http
      .get<AbogadosResponse | Abogado[]>(url)
      .pipe(
        tap((data) => {
          this.abogados = (data as AbogadosResponse).abogados || (data as Abogado[]); 

          if (this.abogados.length === 0) {
            this.errorMensaje = 'No se encontraron abogados con esos criterios.';
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error al cargar abogados:', error);
          this.errorMensaje = 'Error al cargar los abogados. Inténtalo más tarde.';
          return throwError(() => new Error(this.errorMensaje));
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(); 
  }

  ngOnDestroy(): void {
    if (this.cargaSubscription) {
      this.cargaSubscription.unsubscribe();
    }
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
    const url = `${this.baseUrl}/materia/${this.materiaActiva}`;
    this.cargarAbogados(url);
  }
  
  filtrarPorEstado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.estadoActivo = input.value;
    const url = `${this.baseUrl}/estado/${this.estadoActivo}`;
    this.cargarAbogados(url);
  }

  filtrarPorCiudad(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.ciudadActiva = input.value;
    const url = `${this.baseUrl}/ciudad/${this.ciudadActiva}`;
    this.cargarAbogados(url);
  }
  
  limpiarFiltros(): void {
    this.materiaActiva = null;
    this.estadoActivo = null;
    this.ciudadActiva = null;
    this.terminoBusqueda = '';
    this.cargarAbogados(`${this.baseUrl}/abogados`);
  }

  buscarPorNombre(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.limpiarFiltros();
      return;
    }
    const url = `${this.baseUrl}/buscar/${encodeURIComponent(this.terminoBusqueda)}`;
    this.cargarAbogados(url);
  }

  getEstrellas(calificacion: number): string[] {
    const estrellas: string[] = [];
    const numCalificacion = Number(calificacion) || 0; 
    const llena = Math.floor(numCalificacion);
    const media = (numCalificacion % 1 >= 0.5) ? 1 : 0;
    const vacia = 5 - llena - media;

    for (let i = 0; i < llena; i++) estrellas.push('llena');
    if (media > 0) estrellas.push('media');
    for (let i = 0; i < vacia; i++) estrellas.push('vacia');
    
    return estrellas;
  }
  
  contactarAbogado(abogado: Abogado): void {
    if (abogado.email) {
      window.location.href = `mailto:${abogado.email}?subject=Contacto desde DALO`;
    } else {
      console.warn('Este abogado no ha proporcionado un correo electrónico público.');
      this.errorMensaje = 'Este abogado no ha proporcionado un correo electrónico público.';
      setTimeout(() => { this.errorMensaje = ''; }, 3000);
    }
  }
}
