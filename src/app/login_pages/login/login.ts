
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router'; 

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  idRol: number; 
}

@Component({
  selector: 'app-login',
  standalone: true,  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class Login implements OnInit {

  correo: string = '';
  contrasena: string = '';
  
  mensaje: string = '';
  mensajeColor: string = '#000'; 

  private apiUrl: string = 'http://52.3.15.55:7000/api/login';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/usuario/home']);
    }
  }

  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  
  async login(event: Event): Promise<void> {
    event.preventDefault(); 
    if (!this.correo || !this.contrasena) {
      this.mensajeColor = '#D9534F'; 
      this.mensaje = 'Por favor, introduce tu correo y contraseña.';
      return;
    }

    this.mensajeColor = '#006DCC'; 
    this.mensaje = 'Iniciando sesión...';

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: this.correo,
          contraseña: this.contrasena, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);

        this.mensajeColor = '#5CB85C'; 
        this.mensaje = '¡Inicio de sesión exitoso! Redirigiendo...';

        const usuario: Usuario = data.usuario;
        switch (usuario.idRol) {
          case 1: 
            this.router.navigate(['/usuario/home']);
            break;
          case 2: 
            this.router.navigate(['/abogado/foro']); 
            break;
          case 3: 
            this.router.navigate(['/admin/inactivos']);
            break;
          default:
            this.router.navigate(['/usuario/home']);
        }

      } else {
        this.mensajeColor = '#D9534F'; 
        this.mensaje = data.error || 'Credenciales inválidas. Inténtalo de nuevo.';
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.mensajeColor = '#D9534F'; 
      this.mensaje = 'Error de conexión. Inténtalo más tarde.';
    }
  }

 
  clearMensaje(): void {
    this.mensaje = '';
  }
}