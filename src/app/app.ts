import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthState } from './state/auth.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'DALO';

  constructor(private authState: AuthState) { }

  ngOnInit(): void {
    // ✨ Verificar si el token está expirado al iniciar la app
    if (this.authState.isAuthenticated && this.authState.isTokenExpired()) {
      console.warn('Token expirado detectado al iniciar. Cerrando sesión...');
      this.authState.clearAuth();
    }
  }
}