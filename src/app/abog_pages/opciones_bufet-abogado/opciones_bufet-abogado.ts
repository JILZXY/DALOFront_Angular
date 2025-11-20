import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opciones-bufet-abogado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opciones_bufet-abogado.html',
  styleUrls: ['./opciones_bufet-abogado.css']
})
export class OpcionesBufetAbogado implements OnInit {

  opciones = [
    {
      id: 'ver-bufete',
      titulo: 'VER MI',
      subtitulo: 'BUFETE',
      icono: 'eye' // Icono de ojo
    },
    {
      id: 'crear-bufete',
      titulo: 'CREAR',
      subtitulo: 'BUFETE',
      icono: 'plus' // Icono de plus
    },
    {
      id: 'unirse-bufete',
      titulo: 'UNIRSE A',
      subtitulo: 'BUFETE',
      icono: 'join' // Icono de lista con checkmark
    }
  ];

  private baseUrl = 'http://52.3.15.55:7000';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Aquí se pueden cargar datos iniciales si es necesario
  }

  seleccionarOpcion(opcionId: string): void {
    console.log('Opción seleccionada:', opcionId);

    switch (opcionId) {
      case 'ver-bufete':
        // TODO: Conectar con API para verificar si el usuario tiene bufete
        // const tieneBufete = this.verificarBufete(); 
        const tieneBufete = true; // Mock: cambiar a false para probar el caso de error

        if (tieneBufete) {
          this.router.navigate(['/abogado/mi-bufete']);
        } else {
          // Mensaje de error o redirección a vista de inexistente
          console.error('Error: No hay bufete registrado.');
          this.router.navigate(['/abogado/bufete-inexistente']);
        }
        break;
      case 'crear-bufete':
        // TODO: Conectar con API para verificar si el usuario tiene bufete
        // const tieneBufete = this.verificarBufete();
        const tieneBufeteCrear = true; // Mock: cambiar a false para permitir crear

        if (tieneBufeteCrear) {
          this.router.navigate(['/abogado/bufete-existente']);
        } else {
          this.router.navigate(['/abogado/crear-bufete']);
        }
        break;
      case 'unirse-bufete':
        // TODO: Conectar con API para verificar si el usuario tiene bufete
        // const tieneBufete = this.verificarBufete();
        const tieneBufeteUnirse = true; // Mock: cambiar a false para permitir unirse

        if (tieneBufeteUnirse) {
          this.router.navigate(['/abogado/aviso-abandonar-bufete']);
        } else {
          this.router.navigate(['/abogado/bufete-codigo']);
        }
        break;
    }
  }
}

