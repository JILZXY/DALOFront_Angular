import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-estadistica-abogado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadistica-abogado.html',
  styleUrls: ['./estadistica-abogado.css']
})
export class EstadisticaAbogado implements AfterViewInit {

  
  @ViewChild('radarChart') private radarChartCanvas!: ElementRef<HTMLCanvasElement>;
  private radarChart!: Chart;

  constructor() { }

  ngAfterViewInit() {
    this.crearRadarChart();
  }

  crearRadarChart() {
    if (!this.radarChartCanvas) {
      console.error('El elemento canvas del gráfico no se encontró.');
      return;
    }

    const ctx = this.radarChartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D del canvas.');
      return;
    }

    const data = {
      labels: [
        'Atención',
        'Profesionalismo',
        'Claridad',
        'Empatía'
      ],
      datasets: [{
        label: 'Mis Calificaciones',
        data: [0, 0, 0, 0], 
        fill: true,
        backgroundColor: 'rgba(0, 109, 204, 0.2)',
        borderColor: 'rgba(0, 109, 204, 0.8)',
        pointBackgroundColor: 'rgba(0, 109, 204, 0.8)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 109, 204, 0.8)',
        borderWidth: 3
      }]
    };

    const config: any = {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 3
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 5,
            min: 0,
            ticks: {
              stepSize: 1,
              font: { family: 'Montserrat', size: 11 },
              color: '#666'
            },
            pointLabels: {
              font: { family: 'Montserrat', size: 12, weight: '600' },
              color: '#223240'
            },
            grid: { color: '#e0e0e0' },
            angleLines: { color: '#e0e0e0' }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(34, 50, 64, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#006DCC',
            borderWidth: 1,
            titleFont: { family: 'Montserrat', size: 13, weight: '600' },
            bodyFont: { family: 'Montserrat', size: 12 },
            callbacks: {
              label: function(context: any) {
                return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '/5.0';
              }
            }
          }
        }
      }
    };

    this.radarChart = new Chart(ctx, config);
  }
}