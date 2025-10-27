import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Usuario {
  nombre: string;
  idRol: number;
}

@Component({
  selector: 'app-slide-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './slide-user.html',
  styleUrls: ['./slide-user.css']
})
export class SlideUser implements OnInit, OnDestroy {
  isOpen = false;
  private sidebarListener: any;

  userName: string = 'Usuario';
  userRole: string = 'Rol de Usuario';

  private roleMap: { [key: number]: string } = {
    1: 'Usuario',
    2: 'Abogado',
    3: 'Administrador'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData(); 
    
    this.sidebarListener = (event: CustomEvent) => {
      this.isOpen = event.detail;
    };
    window.addEventListener('toggle-sidebar', this.sidebarListener);
  }

  ngOnDestroy() {
    if (this.sidebarListener) {
      window.removeEventListener('toggle-sidebar', this.sidebarListener);
    }
  }
  
  private loadUserData(): void {
    try {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario: Usuario = JSON.parse(usuarioStr);
        this.userName = usuario.nombre;
        this.userRole = this.roleMap[usuario.idRol] || 'Rol Desconocido';
      } else {
        this.userName = 'Invitado';
        this.userRole = 'Sin Sesión';
      }
    } catch (e) {
      console.error('Error al parsear datos de usuario de localStorage', e);
      this.userName = 'Error';
      this.userRole = 'Datos Inválidos';
    }
  }

  closeSidebar() {
    this.isOpen = false;
    window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: false }));
  }

  logout(event: Event) {
    event.preventDefault();
    
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    
    this.closeSidebar();
    
    this.router.navigate(['/login']);
  }
}