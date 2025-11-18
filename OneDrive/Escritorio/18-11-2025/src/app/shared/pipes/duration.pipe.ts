import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  /**
   * Convertir milisegundos a formato MM:SS
   * 
   * Ejemplos:
   * 3450000 | duration → "57:30"
   * 180000 | duration → "03:00"
   * 45000 | duration → "00:45"
   */
  transform(milliseconds: number | null | undefined): string {
    if (!milliseconds || milliseconds <= 0) {
      return '00:00';
    }

    // Convertir ms a segundos
    const totalSeconds = Math.floor(milliseconds / 1000);

    // Calcular minutos y segundos
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Formatear con ceros a la izquierda
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return `${minutesStr}:${secondsStr}`;
  }
}