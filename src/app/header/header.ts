import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthState } from '../state/auth.state';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Usuario } from '../models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  currentUser$!: Observable<Usuario | null>;
  isAuthenticated$!: Observable<boolean>;

  // Para acceso directo a propiedades
  currentUser: Usuario | null = null;

  constructor(
    public authState: AuthState,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Suscribirse a los observables
    this.currentUser$ = this.authState.currentUser$;
    this.isAuthenticated$ = this.authState.isAuthenticated$;

    // También podemos mantener una referencia directa
    this.authState.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // ✨ Método para cerrar sesión
  logout(): void {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      this.authService.logout();
    }
  }

  // ✨ Métodos para verificar roles
  isCliente(): boolean {
    return this.authState.isCliente();
  }

  isAbogado(): boolean {
    return this.authState.isAbogado();
  }

  isAdmin(): boolean {
    return this.authState.isAdmin();
  }

  // ✨ Obtener nombre del usuario
  getNombreUsuario(): string {
    return this.currentUser?.nombre || 'Usuario';
  }

  // ✨ Obtener rol en texto
  getRolTexto(): string {
    if (this.isCliente()) return 'Cliente';
    if (this.isAbogado()) return 'Abogado';
    if (this.isAdmin()) return 'Administrador';
    return '';
  }
}