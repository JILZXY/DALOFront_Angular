import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MateriaCards } from '../materia-cards/materia-cards';
import { ConsultaService } from '../../services/consulta.service';
import { ConsultaState } from '../../state/consulta.state';
import { CreateConsultaRequest } from '../../models';

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
export class PublicarPregunta implements OnInit {

  questionTitle: string = '';
  questionDescription: string = '';
  titleCounter: number = 0;
  descCounter: number = 0;

  selectedMateriaId: string | null = null;

  isModalVisible: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  // Mapping based on the IDs provided by the user (1-7)
  private materiaMapping: any = {
    '1': { id: '1', idNumerico: 1, nombre: 'DERECHO PENAL' },
    '2': { id: '2', idNumerico: 2, nombre: 'DERECHO CIVIL' },
    '3': { id: '3', idNumerico: 3, nombre: 'DERECHO PROCESAL' },
    '4': { id: '4', idNumerico: 4, nombre: 'DERECHO LABORAL' },
    '5': { id: '5', idNumerico: 5, nombre: 'DERECHO MERCANTIL' },
    '6': { id: '6', idNumerico: 6, nombre: 'DERECHO CONSTITUCIONAL' },
    '7': { id: '7', idNumerico: 7, nombre: 'GENERAL' }
  };

  constructor(
    private router: Router,
    private consultaService: ConsultaService,
    private consultaState: ConsultaState
  ) { }

  ngOnInit(): void {
    // No API call needed for specialties as per user request
  }

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

    const materiaInfo = this.materiaMapping[this.selectedMateriaId];
    if (!materiaInfo) {
      this.errorMessage = 'Error: La materia seleccionada no es válida.';
      return;
    }

    this.isLoading = true;
    const request: CreateConsultaRequest = {
      titulo: this.questionTitle,
      pregunta: this.questionDescription,
      esPrivada: false,
      especialidadesIds: [materiaInfo.idNumerico]
    };

    console.log('Enviando consulta:', request);

    this.consultaService.create(request).subscribe({
      next: (consulta) => {
        this.consultaState.addConsulta(consulta);
        this.isLoading = false;
        this.isModalVisible = true;
      },
      error: (err) => {
        console.error('Error al crear consulta:', err);
        this.errorMessage = 'Ocurrió un error al publicar tu pregunta. Inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
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