import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface Usuario {
  nombre: string;
  idRol: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  userName: string = 'Nombre Usuario';
  userRole: string = 'Rol';
  pageTitle: string = 'Título de Página';
  isSidebarActive: boolean = false;

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    try {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario: Usuario = JSON.parse(usuarioStr);
        this.userName = usuario.nombre || 'Nombre Usuario';
        this.userRole = usuario.idRol === 2 ? 'Abogado' : 
                       usuario.idRol === 1 ? 'Usuario' : 
                       'Administrador';
      }
    } catch (e) {
      console.error('Error al cargar datos del usuario:', e);
    }
  }

  toggleSidebar(): void {
    this.isSidebarActive = true;
    window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: true }));
  }

  closeSidebar(): void {
    this.isSidebarActive = false;
    window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: false }));
  }
}