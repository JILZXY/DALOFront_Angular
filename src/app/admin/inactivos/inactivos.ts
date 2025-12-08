import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { UsuarioState } from '../../state/usuario.state';
import { Usuario } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inactive-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inactivos.html',
  styleUrls: ['./inactivos.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class Inactivos implements OnInit {
  usuariosInactivos$: Observable<Usuario[]>;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private usuarioState: UsuarioState
  ) {
    this.usuariosInactivos$ = this.usuarioState.usuariosInactivos$;
  }

  ngOnInit(): void {
    this.loadInactiveUsers();
  }

  loadInactiveUsers(): void {
    this.isLoading = true;
    this.authService.getUsuariosInactivos().subscribe({
      next: (usuarios) => {
        this.usuarioState.setUsuariosInactivos(usuarios);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios inactivos:', err);
        this.errorMessage = 'No se pudieron cargar los usuarios inactivos.';
        this.isLoading = false;
      }
    });
  }

  activarUsuario(id: string): void {
    if (!confirm('¿Estás seguro de activar a este abogado?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.activarUsuario(id).subscribe({
      next: () => {
        this.usuarioState.activarUsuario(id);

        this.successMessage = 'Usuario activado exitosamente.';
        this.isLoading = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error al activar usuario:', err);
        this.errorMessage = 'Error al activar el usuario. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }
}