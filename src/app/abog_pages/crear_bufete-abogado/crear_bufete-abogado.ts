import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BufeteState } from '../../state/bufete.state';

@Component({
    selector: 'app-crear-bufete-abogado',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './crear_bufete-abogado.html',
    styleUrls: ['./crear_bufete-abogado.css']
})
export class CrearBufeteAbogado implements OnInit {

    private apiUrl = 'http://52.3.15.55:7000/bufetes';
    nombre: string = '';
    descripcion: string = '';
    previewUrl: string | ArrayBuffer | null = null;
    selectedFile: File | null = null;
    
    constructor(
        private bufeteState: BufeteState, 
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }

    crear(): void {
        if (!this.nombre.trim()) return;

        const requestData = {
            nombre: this.nombre,
            descripcion: this.descripcion,
            especialidadesIds: [1], // Default or fetch from somewhere
            logo: null
        };

        this.bufeteState.createBufete(requestData).subscribe({
            next: (bufete: any) => {
                console.log('Bufete creado:', bufete);
                // Reload mis bufetes to ensure the newly created one is fetched from the server
                this.bufeteState.loadMisBufetes().subscribe(() => {
                    this.router.navigate(['/abogado/mi-bufete']);
                });
            },
            error: (err: any) => {
                console.error('Error al crear bufete:', err);
                alert('Error al crear el bufete. Intenta nuevamente.');
            }
        });
    }

    onFileSelected(event: any): void {
        // Logic kept for potential future use
    }
}
