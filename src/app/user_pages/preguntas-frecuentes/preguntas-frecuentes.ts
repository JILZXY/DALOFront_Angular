import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriaCards } from '../materia-cards/materia-cards';

interface Pregunta {
  materia: string;
  logo: string;
  titulo: string;
  texto: string;
}

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule, MateriaCards], 
  templateUrl: './preguntas-frecuentes.html',
  styleUrls: ['./preguntas-frecuentes.css']
})
export class PreguntasFrecuentes {

  selectedMateria: string | null = null;

  preguntas: Pregunta[] = [
    { materia: 'general', logo: '/Images/logo_general.png', titulo: '¿Qué es Dalo?', texto: 'Dalo es una plataforma que conecta a personas con preguntas legales con abogados especializados, facilitando la orientación y consulta legal de manera eficiente.' },
    { materia: 'penal', logo: '/Images/logo_penal.png', titulo: '¿Cómo funciona la defensa legal en un caso penal?', texto: 'Un abogado penalista te asiste desde la investigación, te representa en el juicio, y busca la mejor estrategia legal, como acuerdos o la defensa de tu inocencia.' },
    { materia: 'civil', logo: '/Images/logo_civil.png', titulo: '¿Qué tipo de casos maneja el Derecho Civil?', texto: 'El Derecho Civil abarca temas como contratos, herencias, propiedades, divorcios y responsabilidades civiles. Es la base de las relaciones privadas.' },
    { materia: 'general', logo: '/Images/logo_general.png', titulo: '¿Cómo sé si un abogado está capacitado?', texto: 'Verifica que tenga cédula profesional registrada, experiencia en el área legal que necesitas y buenas referencias. Puedes revisar su perfil en plataformas oficiales o colegiaturas profesionales.' },
    { materia: 'general', logo: '/Images/logo_general.png', titulo: '¿Puedo recibir ayuda legal gratuita?', texto: 'Sí. Existen instituciones públicas y privadas que ofrecen orientación legal sin costo, como defensorías públicas, universidades, ONGs o servicios estatales. Es útil en casos donde no puedes pagar un abogado particular.' },
    { materia: 'general', logo: '/Images/logo_general.png', titulo: '¿Qué hacer si no entiendo el proceso legal?', texto: 'Pide a tu abogado que te explique con claridad cada paso. Tienes derecho a entender tu situación legal. No firmes documentos ni tomes decisiones sin comprenderlas por completo.' }
  ];

  constructor() { }

  
  onAreaSelected(areaId: string | null): void {
    if (areaId) {
      this.selectedMateria = areaId.replace('area-', ''); 
    } else {
      this.selectedMateria = null; 
    }
  }

  
  shouldShow(materia: string): boolean {
    if (this.selectedMateria === null) {
      return true; 
    }
    return materia === this.selectedMateria; 
  }
}