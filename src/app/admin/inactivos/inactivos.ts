import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Abogado {
  cedulaProfesional: string;
  biografia?: string;
  descripcion?: string;
}

interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  activo: boolean;
  abogado: Abogado;
}

interface Alert {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Component({
  selector: 'app-inactive-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inactivos.html',
  styleUrls: ['./inactivos.css']
})
export class Inactivos implements OnInit {
  private readonly API_BASE = 'http://52.3.15.55:7000';
  
  inactiveUsers: Usuario[] = [];
  isLoading = true;
  alerts: Alert[] = [];
  private alertCounter = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInactiveUsers();
  }

  async loadInactiveUsers(): Promise<void> {
    try {
      this.isLoading = true;
      const users = await firstValueFrom(
        this.http.get<Usuario[]>(`${this.API_BASE}/usuarios/activos`)
      );
      
      // Filtrar solo usuarios inactivos que sean abogados
      this.inactiveUsers = users.filter(user => !user.activo && user.abogado);
      
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.showAlert('Error al cargar los usuarios inactivos', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async activateUser(userId: number, index: number): Promise<void> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      await firstValueFrom(
        this.http.put(
          `${this.API_BASE}/usuarios/${userId}/sin-contrasena`,
          { activo: true },
          { headers }
        )
      );

      this.showAlert('Usuario activado exitosamente', 'success');
      
      // Remover el usuario de la lista
      this.inactiveUsers.splice(index, 1);
      
    } catch (error) {
      console.error('Error al activar usuario:', error);
      this.showAlert('Error al activar el usuario. Intente nuevamente.', 'error');
    }
  }

  showAlert(message: string, type: 'success' | 'error' = 'success'): void {
    const alert: Alert = {
      message,
      type,
      id: this.alertCounter++
    };
    
    this.alerts.push(alert);
    
    // Remover la alerta después de 5 segundos
    setTimeout(() => {
      this.alerts = this.alerts.filter(a => a.id !== alert.id);
    }, 5000);
  }

  trackByUserId(index: number, user: Usuario): number {
    return user.idUsuario;
  }

  trackByAlertId(index: number, alert: Alert): number {
    return alert.id;
  }
}