import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 

interface PreguntaGuardada {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  materia: {
    id: string;
    nombre: string;
    logo: string;
  };
  usuario: {
    id: number;
    nombre: string;
  };
  respuestasCount?: number; 
  estado?: string;
}

@Component({
  selector: 'app-mis-preguntas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-preguntas.html',
  styleUrls: ['./mis-preguntas.css']
})
export class MisPreguntas implements OnInit {

  preguntas: PreguntaGuardada[] = [];
  isLoading: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      try {
        const storedQuestions = localStorage.getItem('misPreguntas');
        if (storedQuestions) {
          this.preguntas = JSON.parse(storedQuestions).reverse(); 

          this.preguntas.forEach(p => {
            p.respuestasCount = p.respuestasCount ?? Math.floor(Math.random() * 5); 
            p.estado = p.estado ?? (p.respuestasCount > 0 ? 'Respondida' : 'Pendiente');
          });

        } else {
          this.preguntas = []; 
        }
      } catch (e) {
        console.error("Error cargando preguntas de localStorage", e);
        this.preguntas = [];
      }
      
      this.isLoading = false;
    }, 500); 
  }

  
  goToPublicar(): void {
    this.router.navigate(['/usuario/publicar']);
  }

  
  goToComentarios(preguntaId: string): void {
    
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
        return 'hace 0 min';
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
}