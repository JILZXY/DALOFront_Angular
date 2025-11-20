import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SlideUser } from '../user_pages/slide-user/slide-user';
import { SlideAb } from '../abog_pages/slide-ab/slide-ab';
import { SlideAdmin } from '../admin/slide-admin/slide-admin';

interface Usuario {
  nombre: string;
  idRol: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SlideUser, SlideAb, SlideAdmin],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  userName: string = 'Nombre Usuario';
  userRole: string = 'Rol';
  pageTitle: string = 'Título de Página';
  isSidebarActive: boolean = false;

  currentRole: number = 1; 

  private roleMap: { [key: number]: string } = {
    1: 'Usuario',
    2: 'Abogado',
    3: 'Administrador'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateBasedOnUrl();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBasedOnUrl();
    });
  }

  
  private updateBasedOnUrl(): void {
    const url = this.router.url;

    this.updatePageTitle(url);

    if (url.includes('/abogado')) {
      this.currentRole = 2;
      this.userRole = 'Abogado (Test)';
      if (this.userName === 'Nombre Usuario') this.userName = 'Lic. Prueba'; 
    } 
    else if (url.includes('/admin')) {
      this.currentRole = 3;
      this.userRole = 'Administrador (Test)';
    } 
    else {
      this.currentRole = 1; 
      this.loadUserDataFromStorage();
    }
  }

  private loadUserDataFromStorage(): void {
    try {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario: Usuario = JSON.parse(usuarioStr);
        this.userName = usuario.nombre;
        this.currentRole = usuario.idRol; 
        this.userRole = this.roleMap[usuario.idRol] || 'Rol Desconocido';
      } else {
        this.userName = 'Invitado';
        this.userRole = 'Usuario';
      }
    } catch (e) {
      console.error('Error al leer datos locales', e);
    }
  }

  toggleSidebar(): void {
    this.isSidebarActive = !this.isSidebarActive;
  }

  closeSidebar(): void {
    this.isSidebarActive = false;
  }

  private updatePageTitle(url: string): void {
    // Limpiar query params (ej: ?id=1)
    const cleanUrl = url.split('?')[0];
    
    const titleMap: { [key: string]: string } = {
      '/usuario/home': 'Home',
      '/usuario/publicar': 'Publicar Pregunta',
      '/usuario/contactar': 'Contactar Abogados',
      '/usuario/faq': 'Preguntas Frecuentes',
      '/usuario/mis-preguntas': 'Mis Preguntas',
      '/usuario/ayuda': 'Ayuda',
      '/usuario/comentarios': 'Comentarios',
      
      '/abogado/foro': 'Foro de Abogados',
      '/abogado/mis-respuestas': 'Mis Respuestas',
      '/abogado/estadisticas': 'Estadísticas',
      '/abogado/ayuda': 'Ayuda Abogado',
      '/abogado/consultas': 'Consultas Disponibles',
      '/abogado/materias': 'Mis Materias',
      '/abogado/perfil': 'Mi Perfil',
      '/abogado/reporte': 'Reportes',
      '/abogado/respuesta': 'Responder',
      
      '/admin/inactivos': 'Usuarios Inactivos',
      '/admin/reportes': 'Reportes Globales',
      
      '/login': 'Iniciar Sesión',
      '/login/registro-abogado': 'Registro Abogado',
      '/login/registro-usuario': 'Registro Usuario',
      '/login/seleccion': 'Selección'
    };

    this.pageTitle = titleMap[cleanUrl] || 'DALO';
  }
}