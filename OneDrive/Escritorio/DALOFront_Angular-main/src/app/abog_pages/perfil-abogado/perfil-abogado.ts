import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-abogado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-abogado.html',
  styleUrls: ['./perfil-abogado.css']
})
export class PerfilAbogado implements OnInit {
 
  
  nombreAbogado: string = 'Luis Alberto Perez Montiel';
  especializacionAbogado: string = 'Penal';
  ubicacionAbogado: string = 'Suchiapa';
  descripcionAbogado: string = 'Joven abogado que lleva todos los casos perdidos';

  
  calificaciones = {
    general: '100',
    profesionalismo: '70',
    atencion: '100',
    claridad: '90',
    empatia: '80  '
  };

  constructor(private router: Router) {}

  ngOnInit(): void {

  }

  contactar(): void {
    console.log('Contactar al abogado');
  }

  volver(): void {
 
    this.router.navigate(['/abogados']); 

  }
}