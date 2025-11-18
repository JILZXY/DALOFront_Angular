import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Usuario {
  nombre: string;
  idRol: number;
}

@Component({
  selector: 'app-slide-user',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf],
  templateUrl: './slide-user.html',
  styleUrls: ['./slide-user.css']
})
export class SlideUser implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false; 
  @Output() closed = new EventEmitter<void>();

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
    
  }

  ngOnDestroy() {
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
    this.closed.emit();
  }

  logout(event: Event) {
    event.preventDefault();
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.closeSidebar(); 
    this.router.navigate(['/login']);
  }
}