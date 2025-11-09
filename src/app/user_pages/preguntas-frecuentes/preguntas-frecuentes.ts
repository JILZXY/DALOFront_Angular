import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriaCards } from '../materia-cards/materia-cards';

interface Pregunta {
  materia: string;
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
    { materia: 'general', titulo: '¿Qué es Dalo?', texto: 'Dalo es una plataforma que conecta a personas con preguntas legales con abogados especializados, facilitando la orientación y consulta legal de manera eficiente.' },
    
    { materia: 'penal', titulo: '¿Qué hago si me detienen?', texto: 'Tienes derecho a guardar silencio y pedir un abogado inmediatamente. No firmes nada sin su presencia.' },
    { materia: 'penal', titulo: '¿Cómo funciona la fianza?', texto: 'Es una garantía económica para llevar el proceso en libertad. No aplica en delitos graves o prisión preventiva oficiosa.' },

    { materia: 'civil', titulo: '¿Tiene validez un contrato verbal?', texto: 'Sí, pero es difícil de probar en juicio. Se recomienda siempre tener un respaldo escrito ante testigos o notario.' },
    { materia: 'civil', titulo: '¿Cómo recuperar una casa prestada?', texto: 'Debes iniciar un juicio reivindicatorio o de terminación de comodato si la persona se niega a salir.' },

    { materia: 'familiar', titulo: '¿Cuánto es la pensión alimenticia?', texto: 'Generalmente es un porcentaje del sueldo (15-20% por hijo) o una cuota fija basada en las necesidades del menor y posibilidades del padre.' },
    { materia: 'familiar', titulo: '¿Puedo perder la custodia?', texto: 'Solo en casos graves probados ante un juez, como violencia, abandono o adicciones que pongan en riesgo al menor.' },

    { materia: 'laboral', titulo: '¿Cuánto me toca por despido?', texto: 'Si es injustificado: 3 meses de salario, prima de antigüedad, vacaciones no gozadas y aguinaldo proporcional.' },
    { materia: 'laboral', titulo: '¿Me pueden obligar a renunciar?', texto: 'No. Firmar tu renuncia implica perder la indemnización por despido. Si te presionan, acude a Conciliación y Arbitraje.' },

    { materia: 'mercantil', titulo: '¿Cómo cobro un pagaré?', texto: 'Tienes 3 años desde el vencimiento para iniciar un juicio ejecutivo mercantil y solicitar el embargo de bienes.' },
    { materia: 'mercantil', titulo: '¿Qué pasa si mi deudor no tiene bienes?', texto: 'El cobro se vuelve difícil, pero la sentencia queda vigente por años, pudiendo ejecutar el cobro si adquiere bienes en el futuro.' },
    
    { materia: 'constitucional', titulo: '¿Para qué sirve el amparo?', texto: 'Protege tus derechos humanos contra abusos de autoridad, leyes injustas o sentencias que violen el debido proceso.' },

    { materia: 'procesal', titulo: '¿Qué son las etapas procesales?', texto: 'Son las fases de un juicio: postulatoria (demanda), probatoria (pruebas), conclusiva (alegatos) y resolutiva (sentencia).' },
    { materia: 'procesal', titulo: '¿Cuánto dura un juicio promedio?', texto: 'Varía mucho según la materia y el estado, pero puede ir desde 6 meses (juicios orales rápidos) hasta varios años.' }
  ];

  constructor() { }

  onAreaSelected(areaId: string | null): void {
    this.selectedMateria = areaId;
  }

  get preguntasFiltradas(): Pregunta[] {
    if (!this.selectedMateria) {
      return [];
    }
    return this.preguntas.filter(p => p.materia === this.selectedMateria);
  }
}