import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-respuesta-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './respuesta.html',
  styleUrls: ['./respuesta.css']
})
export class Respuesta implements OnInit {
  preguntaOriginal: string = '';
  
  respuesta: string = '';
  
  maxCaracteres: number = 800;

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  enviarRespuesta(): void {
    if (!this.respuesta.trim()) {
      alert('Por favor, escribe una respuesta antes de enviar.');
      return;
    }

    if (this.respuesta.length > this.maxCaracteres) {
      alert(`La respuesta no puede exceder ${this.maxCaracteres} caracteres.`);
      return;
    }

    console.log('Enviando respuesta:', this.respuesta);

  }

  get caracteresRestantes(): number {
    return this.maxCaracteres - this.respuesta.length;
  }


}