import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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

  currentUser: Usuario | null = null;
  isOpen = false;

  constructor(
    public authState: AuthState,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.authState.currentUser$;
    this.isAuthenticated$ = this.authState.isAuthenticated$;

    this.authState.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Abrir/cerrar sidebar
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  closeSidebar(): void {
    this.isOpen = false;
  }

  // Cerrar sesión
  logout(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (confirm('¿Estás seguro de cerrar sesión?')) {
      this.authService.logout();
      this.closeSidebar();
    }
  }

  // Métodos para verificar roles
  isCliente(): boolean {
    return this.authState.isCliente();
  }

  isAbogado(): boolean {
    return this.authState.isAbogado();
  }

  isAdmin(): boolean {
    return this.authState.isAdmin();
  }

  // Getters para el template
  get userName(): string {
    return this.currentUser?.nombre || 'Usuario';
  }

  get userRole(): string {
    if (this.isCliente()) return 'Cliente';
    if (this.isAbogado()) return 'Abogado';
    if (this.isAdmin()) return 'Administrador';
    return '';
  }
}