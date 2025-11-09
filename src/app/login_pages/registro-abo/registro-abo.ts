import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    { id: 'civil', nombre: 'DERECHO CIVIL', icono: '/Images/CIVIL.png' },
    { id: 'familiar', nombre: 'DERECHO FAMILIAR', icono: '/Images/FAMILIAR.png' },
    { id: 'penal', nombre: 'DERECHO PENAL', icono: '/Images/PENAL.png' },
    { id: 'laboral', nombre: 'DERECHO LABORAL', icono: '/Images/LABORAL.png' },
    { id: 'mercantil', nombre: 'DERECHO MERCANTIL', icono: '/Images/MERCANTIL.png' },
    { id: 'constitucional', nombre: 'DERECHO CONSTITUCIONAL', icono: '/Images/CONSTITUCIONAL.png' },
    { id: 'general', nombre: 'GENERAL', icono: '/Images/GENERAL.png' }
  ];

  selectedMaterias: string[] = [];

  estados = [
    "Chiapas", "Nuevo Leon", "Jalisco", "Ciudad de México", "Veracruz", "Aguascalientes"
  ];

  municipios: { [key: string]: string[] } = {
    "Chiapas": ["San Cristobal", "Tuxtla Gutiérrez", "Tapachula", "Comitán de Domínguez", "Palenque"],
    "Nuevo Leon": ["Monterrey", "San Nicolás", "Apodaca"],
    "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque"],
    "Ciudad de México": ["Benito Juárez", "Coyoacán", "Cuauhtémoc"],
    "Veracruz": ["Veracruz", "Xalapa", "Coatzacoalcos"],
    "Aguascalientes": ["Aguascalientes", "Calvillo"]
  };
  municipiosDisponibles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

      biografia: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', Validators.required],

      cedula: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.registroForm.get('estado')?.valueChanges.subscribe(estado => {
      this.municipiosDisponibles = this.municipios[estado] || [];
      this.registroForm.get('municipio')?.setValue('');
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

  toggleMateria(id: string): void {
    if (this.selectedMaterias.includes(id)) {
      this.selectedMaterias = this.selectedMaterias.filter(m => m !== id);
    } else {
      this.selectedMaterias.push(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedMaterias.includes(id);
  }

  cambiarTab(tab: number): void {
    this.errorMessage = '';

    if (tab > this.currentTab) {
        
        if (this.currentTab === 1) {
            const camposTab1 = ['nombre', 'apellidos', 'telefono', 'fechaNacimiento', 'genero', 'estado', 'municipio'];
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
    if (this.selectedMaterias.length === 0) {
        this.errorMessage = 'Selecciona al menos una especialidad.';
        return;
    }

    this.isLoading = true;
    const formData = this.registroForm.value;

    const payload = {
      ...formData,
      idRol: 2, 
      fotoPerfil: this.previewUrl ? this.previewUrl.toString() : '',
      especialidades: this.selectedMaterias
    };

    this.http.post('http://52.3.15.55:7000/usuarios', payload).subscribe({
      next: () => {
        alert('Registro de abogado exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al registrar abogado. Intenta nuevamente.';
        console.error(err);
      }
    });
  }
}