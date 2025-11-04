import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   

@Component({
  selector: 'app-consul-resp',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './consul-resp.html',
  styleUrls: ['./consul-resp.css']
})
export class ConsulResp {

  // Ocultar el modal
  isModalVisible = false;

  // Funciones para abrir y cerrar el modal
  abrirModalReporte() {
    this.isModalVisible = true;
  }

  cerrarModalReporte() {
    this.isModalVisible = false;
  }
}