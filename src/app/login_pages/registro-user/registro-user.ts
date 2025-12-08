import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../state/auth.state';
import { EstadoService } from '../../services/estado.service';
import { RegisterRequest } from '../../models';

@Component({
  selector: 'app-registro-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-user.html',
  styleUrls: ['./registro-user.css']
})
export class RegistroUser implements OnInit {
  registroForm: FormGroup;
  currentTab: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  estados: any[] = [];
  municipios: any[] = [];
  municipiosFiltrados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authState: AuthState,
    private estadoService: EstadoService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)]],
      estadoId: ['', Validators.required],
      municipioId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.estadoService.getAllEstados().subscribe({
      next: (estados) => {
        this.estados = estados;
      },
      error: (err) => {
        console.error('Error al cargar estados:', err);
        this.errorMessage = 'No se pudieron cargar los estados.';
      }
    });

    this.estadoService.getAllMunicipios().subscribe({
      next: (municipios) => {
        this.municipios = municipios;
      },
      error: (err) => {
        console.error('Error al cargar municipios:', err);
      }
    });

    this.registroForm.get('estadoId')?.valueChanges.subscribe(estadoId => {
      if (estadoId) {
        this.municipiosFiltrados = this.municipios.filter(
          m => m.estadoId === Number(estadoId)
        );
        this.registroForm.get('municipioId')?.setValue('');
      } else {
        this.municipiosFiltrados = [];
      }
    });
  }

  cambiarTab(tab: number): void {
    if (tab === 2) {
      const controls = ['nombre', 'estadoId', 'municipioId'];
      const isValid = controls.every(c => this.registroForm.get(c)?.valid);

      if (!isValid) {
        this.errorMessage = 'Por favor completa todos los datos personales correctamente.';
        return;
      }
    }

    this.errorMessage = '';
    this.currentTab = tab;
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor verifica todos los campos.';
      return;
    }

    if (this.registroForm.value.password !== this.registroForm.value.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.registroForm.value;

    const payload: RegisterRequest = {
      nombre: formData.nombre,
      email: formData.email,
      contrasena: formData.password,
      municipioId: formData.municipioId ? Number(formData.municipioId) : null,
      rolId: 1  
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.authState.setAuth(response.token, response.usuario);

        alert('¡Registro exitoso! Bienvenido a DALO.');
        this.router.navigate(['/usuario/home']);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 400) {
          this.errorMessage = 'El correo ya está registrado. Intenta con otro.';
        } else if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica tu red.';
        } else {
          this.errorMessage = error.error?.error || 'Error al registrar. Intenta nuevamente.';
        }
      }
    });
  }
}