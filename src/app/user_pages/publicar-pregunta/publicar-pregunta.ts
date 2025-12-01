import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MateriaCards } from '../materia-cards/materia-cards';
import { ConsultaService } from '../../services/consulta.service';
import { ConsultaState } from '../../state/consulta.state';
import { EspecialidadService } from '../../services/especialidad.service';
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

  constructor(
    private router: Router,
    private consultaService: ConsultaService,
    private consultaState: ConsultaState,
    private especialidadService: EspecialidadService
  ) { }

  ngOnInit(): void {
    this.fetchEspecialidades();
  }

  fetchEspecialidades(): void {
    this.especialidadService.getAll().subscribe({
      next: (especialidades) => {
        console.log('Especialidades cargadas:', especialidades);
        // Actualizar IDs en el mapping basado en el nombre
        especialidades.forEach(esp => {
          // Usamos nombreMateria en lugar de nombre
          const nombreNormalizado = esp.nombreMateria.toUpperCase().trim();

          for (const key in this.materiaMapping) {
            const mapping = this.materiaMapping[key];
            if (mapping.nombre === nombreNormalizado) {
              mapping.idNumerico = esp.id;
              console.log(`Mapeado ${mapping.nombre} a ID ${esp.id}`);
            }
          }
        });
      },
      error: (err) => console.error('Error al cargar especialidades:', err)
    });
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