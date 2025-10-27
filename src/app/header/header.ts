import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter} from 'rxjs/operators';
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

  constructor(private router:Router) {}

  ngOnInit(): void {
    this.loadUserData();
    this.updatePageTitle();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
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

  private updatePageTitle(): void {
    const url = this.router.url;
    
    const titleMap: { [key: string]: string } = {

      '/usuario/home': 'Home',
      '/usuario/publicar': 'Publicar Pregunta',
      '/usuario/contactar': 'Contactar Abogados',
      '/usuario/faq': 'Preguntas Frecuentes',
      '/usuario/mis-preguntas': 'Mis Preguntas',
      '/usuario/ayuda': 'Ayuda',
      '/usuario/comentarios': 'Comentarios',
      
      '/abogado/foro': 'Foro',
      '/abogado/mis-respuestas': 'Mis Respuestas',
      '/abogado/estadisticas': 'Estadísticas',
      '/abogado/ayuda': 'Ayuda',
      '/abogado/consultas': 'Consultas',
      '/abogado/materias': 'Materias',
      '/abogado/perfil': 'Perfil',
      '/abogado/reporte': 'Reportes',
      '/abogado/respuesta': 'Respuesta',
      
      '/admin/inactivos': 'Usuarios Inactivos',
      '/admin/reportes': 'Reportes',
      
      '/login': 'Iniciar Sesión',
      '/login/registro-abogado': 'Registro Abogado',
      '/login/registro-usuario': 'Registro Usuario',
      '/login/seleccion': 'Selección'
    };

    this.pageTitle = titleMap[url] || 'Página';
  }

  // ✅ AGREGAR ESTE MÉTODO NUEVO:
  getUserRole(): number | null {
    try {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario: Usuario = JSON.parse(usuarioStr);
        return usuario.idRol;
      }
    } catch (e) {
      console.error('Error al obtener rol:', e);
    }
    return null;
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