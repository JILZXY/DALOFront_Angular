import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-respuestas',
  templateUrl: './mis-respuestas.html',
  styleUrls: ['./mis-respuestas.css']
})
export class MisRespuestas implements OnInit {
  
  modalCalificacionVisible = false;
  modalSinCalificacionVisible = false;
  
  calificacionActual = {
    promedio: 10,
    atencion: 9,
    profesionalismo: 7,
    claridad: 8,
    empatia: 10
  };

  constructor() { }

  ngOnInit(): void {
    
  }

  abrirModalConCalificacion(respuestaId: number): void {
   
    this.modalCalificacionVisible = true;
    document.body.style.overflow = 'hidden';
  }

  abrirModalSinCalificacion(): void {
    this.modalSinCalificacionVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalCalificacion(): void {
    this.modalCalificacionVisible = false;
    this.modalSinCalificacionVisible = false;
    document.body.style.overflow = 'auto';
  }

  // Manejar clic en overlay del modal
  onModalOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrarModalCalificacion();
    }
  }

 onEscapeKey(event: Event): void {
  const keyEvent = event as KeyboardEvent;
  if (keyEvent.key === 'Escape') {
    this.cerrarModalCalificacion();
  }
}

}