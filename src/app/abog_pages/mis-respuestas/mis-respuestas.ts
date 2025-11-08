import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Usuario {
  nombre: string;
}

interface Calificacion {
  profesionalismo: number;
  atencion: number;
  claridad: number;
  empatia: number;
  promedio: number;
  comentario?: string;
}

interface Respuesta {
  idRespuesta: number;
  preguntaTitulo: string;
  preguntaDescripcion: string;
  contenidoRespuesta: string;
  fechaRespuesta: string;
  usuarioCliente: Usuario;
  calificacion?: Calificacion; 
}

@Component({
  selector: 'app-mis-respuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-respuestas.html',
  styleUrls: ['./mis-respuestas.css']
})
export class MisRespuestas implements OnInit, OnDestroy {

  respuestas: Respuesta[] = [];
  isLoading: boolean = true;
  
  mostrarModal: boolean = false;
  modalTipo: 'con-calificacion' | 'sin-calificacion' = 'sin-calificacion';
  calificacionSeleccionada: Calificacion | null = null;

  private sub: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatosSimulados();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  cargarDatosSimulados(): void {
    this.isLoading = true;

    const datos: Respuesta[] = [
      {
        idRespuesta: 1,
        preguntaTitulo: "¿Pueden despedirme estando embarazada?",
        preguntaDescripcion: "Llevo 3 meses en la empresa y notifiqué mi embarazo. Hoy me dijeron que mi contrato terminó.",
        contenidoRespuesta: "El despido por motivo de embarazo es ilegal y constituye discriminación. Tienes derecho a la reinstalación o a una indemnización constitucional. Te sugiero acudir a la PROFEDET inmediatamente.",
        fechaRespuesta: new Date().toISOString(),
        usuarioCliente: { nombre: "Laura M." },
        calificacion: {
          profesionalismo: 5,
          atencion: 5,
          claridad: 5,
          empatia: 4,
          promedio: 4.8
        }
      },
      {
        idRespuesta: 2,
        preguntaTitulo: "Divorcio incausado costo",
        preguntaDescripcion: "Quiero saber cuánto cuesta aproximadamente y cuánto tarda un divorcio donde ambos estamos de acuerdo.",
        contenidoRespuesta: "Si es de mutuo acuerdo (voluntario), el proceso es mucho más rápido, oscilando entre 1 y 3 meses dependiendo de la carga del juzgado. Los honorarios varían, pero puedo ofrecerte una asesoría inicial gratuita.",
        fechaRespuesta: new Date(Date.now() - 86400000 * 2).toISOString(),
        usuarioCliente: { nombre: "Pedro S." } 
      },
      {
        idRespuesta: 3,
        preguntaTitulo: "Herencia sin testamento",
        preguntaDescripcion: "Mi padre falleció sin dejar testamento. Somos 3 hermanos y mi madre. ¿Cómo se reparte?",
        contenidoRespuesta: "Al no haber testamento, se abre una sucesión legítima (intestamentaria). La herencia se reparte en partes iguales entre los hijos y la esposa (quien hereda como un hijo más si no tiene bienes propios).",
        fechaRespuesta: new Date(Date.now() - 86400000 * 5).toISOString(),
        usuarioCliente: { nombre: "Familia R." },
        calificacion: {
          profesionalismo: 4,
          atencion: 5,
          claridad: 4,
          empatia: 3,
          promedio: 4.0
        }
      }
    ];

    this.sub = of(datos).pipe(delay(800)).subscribe(data => {
      this.respuestas = data;
      this.isLoading = false;
    });
  }

  verCalificacion(respuesta: Respuesta): void {
    if (respuesta.calificacion) {
      this.calificacionSeleccionada = respuesta.calificacion;
      this.modalTipo = 'con-calificacion';
    } else {
      this.calificacionSeleccionada = null;
      this.modalTipo = 'sin-calificacion';
    }
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  getEstrellas(promedio: number): string[] {
    const estrellas = [];
    const enteras = Math.floor(promedio);
    const media = promedio % 1 >= 0.5;
    
    for (let i = 0; i < enteras; i++) estrellas.push('★');
    if (media) estrellas.push('½'); 
    while (estrellas.length < 5) estrellas.push('☆');
    
    return estrellas;
  }

  formatTime(fecha: string): string {
    const d = new Date(fecha);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}