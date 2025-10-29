import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  idRol: number;
}

interface LoginResponse {
  usuario: Usuario;
  token: string;
  error?: string; 
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';
  mensajeColor: string = '#000';
  isLoading: boolean = false; 

  private apiUrl: string = 'http://52.3.15.55:7000/api/login';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/usuario/home']);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  
  login(event: Event): void {
    event.preventDefault();

    if (!this.correo || !this.contrasena) {
      this.mensajeColor = '#D9534F';
      this.mensaje = 'Por favor, introduce tu correo y contraseña.';
      return;
    }

    this.isLoading = true; 
    this.mensajeColor = '#006DCC';
    this.mensaje = 'Iniciando sesión...';

    const body = {
      correo: this.correo,
      contraseña: this.contrasena,
    };

    this.http.post<LoginResponse>(this.apiUrl, body)
      .pipe(
        tap((data) => {
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
          localStorage.setItem('token', data.token);

          this.mensajeColor = '#5CB85C';
          this.mensaje = '¡Inicio de sesión exitoso! Redirigiendo...';

          const usuario: Usuario = data.usuario;
          switch (usuario.idRol) {
            case 1: this.router.navigate(['/usuario/home']); break;
            case 2: this.router.navigate(['/abogado/foro']); break;
            case 3: this.router.navigate(['/admin/inactivos']); break;
            default: this.router.navigate(['/usuario/home']);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.mensaje = 'Error de conexión. Inténtalo más tarde.';
          } else {
            this.mensaje = error.error?.error || 'Credenciales inválidas.';
          }
          this.mensajeColor = '#D9534F';
          
          return throwError(() => new Error(this.mensaje));
        }),
        finalize(() => {
          this.isLoading = false; 
        })
      )
      .subscribe(); 
  }

  clearMensaje(): void {
    this.mensaje = '';
  }
}
