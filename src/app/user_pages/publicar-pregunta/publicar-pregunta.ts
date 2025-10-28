
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { MateriaCards } from '../materia-cards/materia-cards'; 

interface Usuario {
  id: number;
  nombre: string;
}

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
}

@Component({
  selector: 'app-publicar-pregunta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  
    MateriaCards  
  ],
  templateUrl: './publicar-pregunta.html',
  styleUrls: ['./publicar-pregunta.css']
})
export class PublicarPregunta {

  questionTitle: string = '';
  questionDescription: string = '';
  titleCounter: number = 0;
  descCounter: number = 0;

  selectedMateriaId: string | null = null; 

  isModalVisible: boolean = false;
  errorMessage: string = '';

  private materiaMapping: any = {
    'penal': { id: 'penal', idNumerico: 1, nombre: 'DERECHO PENAL', logo: '/Images/logo_penal.png' },
    'civil': { id: 'civil', idNumerico: 2, nombre: 'DERECHO CIVIL', logo: '/Images/logo_civil.png' },
    'procesal': { id: 'procesal', idNumerico: 3, nombre: 'DERECHO PROCESAL', logo: '/Images/logo_procesal.png' },
    'laboral': { id: 'laboral', idNumerico: 4, nombre: 'DERECHO LABORAL', logo: '/Images/logo_laboral.png' },
    'mercantil': { id: 'mercantil', idNumerico: 5, nombre: 'DERECHO MERCANTIL', logo: '/Images/logo_mercantil.png' },
    'constitucional': { id: 'constitucional', idNumerico: 6, nombre: 'DERECHO CONSTITUCIONAL', logo: '/Images/logo_constitucional.png' },
    'general': { id: 'general', idNumerico: 7, nombre: 'GENERAL', logo: '/Images/logo_general.png' },
    'familiar': { id: 'familiar', idNumerico: 8, nombre: 'DERECHO FAMILIAR', logo: '/Images/logo_laboral.png' } 
  };

  constructor(private router: Router) {}

  updateTitleCounter(): void {
    this.titleCounter = this.questionTitle.length;
  }

  updateDescCounter(): void {
    this.descCounter = this.questionDescription.length;
  }

  onMateriaSelected(materiaId: string | null): void {
    this.selectedMateriaId = materiaId;
    if (materiaId) {
      this.errorMessage = '';
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.questionTitle.trim()) {
      this.errorMessage = 'Por favor, escribe un título para tu pregunta.';
      return;
    }
    if (!this.questionDescription.trim()) {
      this.errorMessage = 'Por favor, añade una descripción.';
      return;
    }
    if (!this.selectedMateriaId) {
      this.errorMessage = 'Por favor, selecciona una materia.';
      return;
    }

    const usuario: Usuario | null = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!usuario) {
      this.errorMessage = 'Error: No se encontró la sesión de usuario. Por favor, inicia sesión de nuevo.';
      return;
    }

    const materiaInfo = this.materiaMapping[this.selectedMateriaId];
    if (!materiaInfo) {
      this.errorMessage = 'Error: La materia seleccionada no es válida.';
      return;
    }

    const newQuestion: PreguntaGuardada = {
      id: `q-${Date.now()}`,
      titulo: this.questionTitle,
      descripcion: this.questionDescription,
      fecha: new Date().toISOString(),
      materia: {
        id: materiaInfo.id,
        nombre: materiaInfo.nombre,
        logo: materiaInfo.logo
      },
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre
      }
    };

    try {
      const allQuestions: PreguntaGuardada[] = JSON.parse(localStorage.getItem('misPreguntas') || '[]');
      allQuestions.push(newQuestion);
      localStorage.setItem('misPreguntas', JSON.stringify(allQuestions));

      this.isModalVisible = true;

    } catch (e) {
      this.errorMessage = 'Error al guardar la pregunta.';
      console.error(e);
    }
  }

  
  stayHere(): void {
    this.isModalVisible = false;
    this.clearForm();
  }

  goToMisPreguntas(): void {
    this.router.navigate(['/usuario/mis-preguntas']);
  }

  private clearForm(): void {
    this.questionTitle = '';
    this.questionDescription = '';
    this.selectedMateriaId = null;
    this.errorMessage = '';
    this.titleCounter = 0;
    this.descCounter = 0;
    
  }
}