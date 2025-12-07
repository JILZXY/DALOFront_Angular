import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BufeteState } from '../../state/bufete.state';
import { map, take } from 'rxjs/operators';

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
      icono: 'eye'
    },
    {
      id: 'crear-bufete',
      titulo: 'CREAR',
      subtitulo: 'BUFETE',
      icono: 'plus'
    },
    {
      id: 'unirse-bufete',
      titulo: 'UNIRSE A',
      subtitulo: 'BUFETE',
      icono: 'join'
    }
  ];

  constructor(
    private router: Router,
    private bufeteState: BufeteState
  ) { }

  ngOnInit(): void {
    this.bufeteState.loadMisBufetes();
  }

  seleccionarOpcion(opcionId: string): void {
    this.bufeteState.misBufetes$.pipe(take(1)).subscribe(misBufetes => {
        const tieneBufete = misBufetes && misBufetes.length > 0;
        
        switch (opcionId) {
          case 'ver-bufete':
            if (tieneBufete) {
              this.router.navigate(['/abogado/mi-bufete']);
            } else {
              this.router.navigate(['/abogado/bufete-inexistente']);
            }
            break;

          case 'crear-bufete':
            if (tieneBufete) {
              this.router.navigate(['/abogado/bufete-existente']); // Or specific "Already have bufete" page
            } else {
              this.router.navigate(['/abogado/crear-bufete']);
            }
            break;

          case 'unirse-bufete':
            if (tieneBufete) {
              this.router.navigate(['/abogado/aviso-abandonar-bufete']);
            } else {
              // Now pointing to the list of bufetes to join
              this.router.navigate(['/abogado/bufete-existente']);
            }
            break;
        }
    });
  }
}

