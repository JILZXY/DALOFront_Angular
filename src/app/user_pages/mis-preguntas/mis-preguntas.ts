import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 
import { Observable } from 'rxjs';
import { ConsultaService } from '../../services/consulta.service';
import { ConsultaState } from '../../state/consulta.state';
import { Consulta } from '../../models';

@Component({
  selector: 'app-mis-preguntas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-preguntas.html',
  styleUrls: ['./mis-preguntas.css']
})
export class MisPreguntas implements OnInit {

  preguntas$: Observable<Consulta[]>;
  isLoading$: Observable<boolean>;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private consultaService: ConsultaService,
    private consultaState: ConsultaState
  ) {
    this.preguntas$ = this.consultaState.misConsultas$;
    this.isLoading$ = this.consultaState.loading$;
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.consultaState.setLoading(true);
    this.consultaService.getMisConsultas().subscribe({
      next: (consultas) => {
        this.consultaState.setMisConsultas(consultas);
        this.consultaState.setLoading(false);
      },
      error: (err) => {
        console.error('Error al cargar mis preguntas:', err);
        this.errorMessage = 'No se pudieron cargar tus preguntas. Intenta nuevamente.';
        this.consultaState.setLoading(false);
      }
    });
  }

  goToPublicar(): void {
    this.router.navigate(['/usuario/publicar']);
  }

  goToComentarios(preguntaId: number): void {
    this.router.navigate(['/usuario/comentarios'], { queryParams: { id: preguntaId } });
  }

  formatTimeAgo(fecha: string): string {
    if (!fecha) {
      return 'fecha no disponible';
    }
    
    try {
      const ahora = new Date();
      const fechaPregunta = new Date(fecha);
      const diferencia = ahora.getTime() - fechaPregunta.getTime();
      
      const minutos = Math.floor(diferencia / 60000);
      const horas = Math.floor(diferencia / 3600000);
      const dias = Math.floor(diferencia / 86400000);
      
      if (minutos < 1) {
        return 'hace un momento';
      } else if (minutos < 60) {
        return `hace ${minutos} min`;
      } else if (horas < 24) {
        return `hace ${horas} h`;
      } else {
        return `hace ${dias} d`;
      }
    } catch (error) {
      console.error('Error al formatear tiempo:', error);
      return 'Fecha inválida';
    }
  }

  getMateriaLogo(nombre: string | undefined): string {
    if (!nombre) return 'Images/GENERAL.png';
    
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('civil')) return 'Images/CIVIL.png';
    if (nombreLower.includes('penal')) return 'Images/Derecho Penal.png';
    if (nombreLower.includes('laboral')) return 'Images/LABORAL.png';
    if (nombreLower.includes('mercantil')) return 'Images/MERCANTIL.png';
    if (nombreLower.includes('constitucional')) return 'Images/CONSTITUCIONAL.png';
    if (nombreLower.includes('procesal')) return 'Images/PROCESAL.png';
    
    return 'Images/GENERAL.png';
  }
}