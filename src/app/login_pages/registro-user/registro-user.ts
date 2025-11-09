import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', Validators.required],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.registroForm.get('estado')?.valueChanges.subscribe(estado => {
      this.municipiosDisponibles = this.municipios[estado] || [];
      this.registroForm.get('municipio')?.setValue('');
    });
  }

  cambiarTab(tab: number): void {
    if (tab === 2) {
      const controls = ['nombre', 'apellidos', 'telefono', 'fechaNacimiento', 'genero', 'estado', 'municipio'];
      const isValid = controls.every(c => this.registroForm.get(c)?.valid);
      
      if (!isValid) {
        this.errorMessage = 'Por favor completa todos los datos personales correctamente.';
        return;
      }
      
      // Validar edad > 18
      const fecha = new Date(this.registroForm.get('fechaNacimiento')?.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const m = hoy.getMonth() - fecha.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }
      if (edad < 18) {
        this.errorMessage = 'Debes ser mayor de 18 años.';
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
    const formData = this.registroForm.value;

    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero,
      idRol: 1, 
      correo: formData.email,
      contraseña: formData.password,
      estado: formData.estado,
      ciudad: formData.municipio
    };

    this.http.post('http://52.3.15.55:7000/usuarios', payload).subscribe({
      next: () => {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al registrar usuario. Intenta nuevamente.';
        console.error(err);
      }
    });
  }
}