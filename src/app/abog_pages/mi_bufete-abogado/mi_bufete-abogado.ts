import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Abogado {
    id: number;
    nombre: string;
    especialidad: string;
    bufete: string;
    ubicacion: string;
    calificacion: number;
    foto: string;
    ranking: number;
}

@Component({
    selector: 'app-mi-bufete-abogado',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mi_bufete-abogado.html',
    styleUrls: ['./mi_bufete-abogado.css']
})
export class MiBufeteAbogado implements OnInit {

    private apiUrl = 'http://52.3.15.55:7000/bufetes/mi-bufete'; // Endpoint requested
    selectedFilter: string = 'PENAL';

    // Mock data based on the image and requirements
    abogados: Abogado[] = [
        {
            id: 1,
            nombre: 'JESHUA GABRIEL MÁRQUEZ CASTAÑO',
            especialidad: 'Derecho Penal',
            bufete: 'Rodrigo & Asociados',
            ubicacion: 'Tapachula, Chiapas',
            calificacion: 4.2,
            foto: '/Images/logo azul.png', // Placeholder
            ranking: 1
        },
        {
            id: 2,
            nombre: 'MARIA FERNANDA LOPEZ',
            especialidad: 'Derecho Civil',
            bufete: 'Rodrigo & Asociados',
            ubicacion: 'Tuxtla Gutiérrez, Chiapas',
            calificacion: 4.8,
            foto: '/Images/logo azul.png',
            ranking: 2
        },
        {
            id: 3,
            nombre: 'CARLOS RUIZ',
            especialidad: 'Derecho Mercantil',
            bufete: 'Rodrigo & Asociados',
            ubicacion: 'San Cristóbal, Chiapas',
            calificacion: 4.5,
            foto: '/Images/logo azul.png',
            ranking: 3
        },
        {
            id: 4,
            nombre: 'ANA MARTINEZ',
            especialidad: 'Derecho Constitucional',
            bufete: 'Rodrigo & Asociados',
            ubicacion: 'Comitán, Chiapas',
            calificacion: 4.9,
            foto: '/Images/logo azul.png',
            ranking: 4
        },
        {
            id: 5,
            nombre: 'LUIS PEREZ',
            especialidad: 'Derecho Penal',
            bufete: 'Rodrigo & Asociados',
            ubicacion: 'Tapachula, Chiapas',
            calificacion: 4.0,
            foto: '/Images/logo azul.png',
            ranking: 5
        }
    ];

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
        // Here we would fetch data from the API
    }

    get filteredAbogados(): Abogado[] {
        return this.abogados.filter(abogado =>
            abogado.especialidad.toUpperCase().includes(this.selectedFilter)
        );
    }

    setFilter(filter: string): void {
        this.selectedFilter = filter;
    }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }

    salirDelBufete(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }
}
