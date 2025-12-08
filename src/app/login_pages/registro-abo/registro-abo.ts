import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EstadoService } from '../../services/estado.service';
import { RegisterAbogadoRequest } from '../../models';

@Component({
  selector: 'app-registro-abo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-abo.html',
  styleUrls: ['./registro-abo.css']
})
export class RegistroAbo implements OnInit {
  registroForm: FormGroup;
  currentTab: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  materias = [
    { id: 1, nombre: 'DERECHO CIVIL', icono: '/Images/CIVIL.png' },
    { id: 2, nombre: 'DERECHO FAMILIAR', icono: '/Images/FAMILIAR.png' },
    { id: 3, nombre: 'DERECHO PENAL', icono: '/Images/PENAL.png' },
    { id: 4, nombre: 'DERECHO LABORAL', icono: '/Images/LABORAL.png' },
    { id: 5, nombre: 'DERECHO MERCANTIL', icono: '/Images/MERCANTIL.png' },
    { id: 6, nombre: 'DERECHO CONSTITUCIONAL', icono: '/Images/CONSTITUCIONAL.png' },
    { id: 7, nombre: 'GENERAL', icono: '/Images/GENERAL.png' }
  ];

  selectedMaterias: number[] = [];

  estados: any[] = [];
  municipios: any[] = [];
  municipiosFiltrados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private estadoService: EstadoService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      estadoId: ['', Validators.required],
      municipioId: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

      biografia: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', Validators.required],

      cedula: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar estados
    this.estadoService.getAllEstados().subscribe({
      next: (estados) => {
        this.estados = estados;
      },
      error: (err) => {
        console.error('Error al cargar estados:', err);
        this.errorMessage = 'No se pudieron cargar los estados.';
      }
    });

    // Cargar municipios
    this.estadoService.getAllMunicipios().subscribe({
      next: (municipios) => {
        this.municipios = municipios;
      },
      error: (err) => {
        console.error('Error al cargar municipios:', err);
      }
    });

    // Filtrar municipios por estado
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  toggleMateria(id: number): void {
    if (this.selectedMaterias.includes(id)) {
      this.selectedMaterias = this.selectedMaterias.filter(m => m !== id);
    } else {
      // Only allow selection if less than 3 specialties are already selected
      if (this.selectedMaterias.length < 3) {
        this.selectedMaterias.push(id);
      }
    }
  }

  isSelected(id: number): boolean {
    return this.selectedMaterias.includes(id);
  }

  cambiarTab(tab: number): void {
    this.errorMessage = '';

    if (tab > this.currentTab) {
      // Validar Tab 1: Datos Personales
      if (this.currentTab === 1) {
        const camposTab1 = ['nombre', 'estadoId', 'municipioId'];
        const invalidos = camposTab1.filter(c => this.registroForm.get(c)?.invalid);

        if (invalidos.length > 0) {
          this.errorMessage = 'Por favor completa todos los datos personales.';
          return;
        }
      }

      if (this.currentTab === 2) {
        if (this.registroForm.get('email')?.invalid) {
          this.errorMessage = 'Ingresa un correo válido.';
          return;
        }
        if (this.registroForm.get('password')?.invalid) {
          this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
          return;
        }
        if (this.registroForm.get('password')?.value !== this.registroForm.get('confirmPassword')?.value) {
          this.errorMessage = 'Las contraseñas no coinciden.';
          return;
        }
      }

      if (this.currentTab === 3) {
        if (this.registroForm.get('biografia')?.invalid || this.registroForm.get('descripcion')?.invalid) {
          this.errorMessage = 'Completa tu biografía y descripción.';
          return;
        }
      }
    }

    this.currentTab = tab;
  }

  onSubmit(): void {
    if (this.registroForm.get('cedula')?.invalid) {
      this.errorMessage = 'Ingresa tu cédula profesional.';
      return;
    }

    // Validar especialidades
    if (this.selectedMaterias.length === 0) {
      this.errorMessage = 'Selecciona al menos una especialidad.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.registroForm.value;

    // ✨ NUEVO: UN SOLO REQUEST CON TODO
    const payload: RegisterAbogadoRequest = {
      // Datos de Usuario
      nombre: formData.nombre,
      email: formData.email,
      contrasena: formData.password,
      municipioId: formData.municipioId ? Number(formData.municipioId) : null,

      // Datos de Abogado
      cedulaProfesional: formData.cedula,
      biografia: formData.biografia || null,
      especialidadesIds: this.selectedMaterias
    };

    // ✨ LLAMADA AL NUEVO ENDPOINT
    this.authService.registerAbogado(payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Mensaje de éxito
        alert(
          '¡Registro exitoso!\n\n' +
          'Tu cuenta ha sido creada y está pendiente de validación.\n' +
          'Un administrador revisará tu cédula profesional.\n\n' +
          'Recibirás una notificación cuando tu cuenta esté activa.\n' +
          'Podrás iniciar sesión una vez que seas activado.\n\n' +
          '¡Gracias por unirte a DALO!'
        );

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 400) {
          this.errorMessage = 'El correo ya está registrado o la cédula es inválida. Verifica tus datos.';
        } else if (error.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica tu red.';
        } else {
          this.errorMessage = error.error?.error || 'Error al registrar. Intenta nuevamente.';
        }
      }
    });
  }
}
