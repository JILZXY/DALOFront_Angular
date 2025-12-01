import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../state/auth.state';
import { LoginRequest } from '../../models';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private authState: AuthState
  ) { }

  ngOnInit(): void {
    if (this.authState.isAuthenticated) {
      this.redirectByRole();
    }
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

    const credentials: LoginRequest = {
      email: this.correo,
      contrasena: this.contrasena
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (!response.usuario.activo) {
          this.mensajeColor = '#F0AD4E';
          this.mensaje = 'Tu cuenta está pendiente de activación. Un administrador debe validar tu cédula profesional.';
          this.isLoading = false;
          return;
        }

        this.authState.setAuth(response.token, response.usuario);

        this.mensajeColor = '#5CB85C';
        this.mensaje = '¡Inicio de sesión exitoso! Redirigiendo...';

        setTimeout(() => {
          this.redirectByRole();
        }, 500);
      },
      error: (error) => {
        this.isLoading = false;
        this.mensajeColor = '#D9534F';

        if (error.status === 0) {
          this.mensaje = 'Error de conexión. Verifica tu red e inténtalo más tarde.';
        } else if (error.status === 401) {
          this.mensaje = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else {
          this.mensaje = error.error?.error || 'Error al iniciar sesión. Intenta nuevamente.';
        }
      }
    });
  }

  private redirectByRole(): void {
    const role = this.authState.userRole;

    switch (role) {
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
  }

  clearMensaje(): void {
    this.mensaje = '';
  }
}