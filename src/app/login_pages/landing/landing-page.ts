import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Testimonio {
  texto: string;
  autor: string;
  rol: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingPage implements OnInit, OnDestroy {

  testimonios: Testimonio[] = [
    {
      texto: "Gracias a DALO pude resolver una duda legal sobre mi contrato laboral en cuestión de minutos. La respuesta fue clara y muy profesional.",
      autor: "Ana Martínez",
      rol: "Usuario"
    },
    {
      texto: "Como abogado, esta plataforma me ha permitido conectar con clientes potenciales de manera rápida y organizada. Es una herramienta indispensable.",
      autor: "Lic. Roberto Gómez",
      rol: "Abogado Penalista"
    },
    {
      texto: "Me sentía perdida con un trámite familiar, pero la orientación que recibí aquí me dio la tranquilidad que necesitaba para proceder.",
      autor: "Sofía Ramírez",
      rol: "Usuario"
    }
  ];

  currentIndex: number = 0;
  private intervalId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCarousel(): void {
    this.intervalId = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonios.length;
  }

  prevTestimonial(): void {
    this.currentIndex = (this.currentIndex - 1 + this.testimonios.length) % this.testimonios.length;
  }

  irASeleccion(): void {
    this.router.navigate(['/login/seleccion']);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}