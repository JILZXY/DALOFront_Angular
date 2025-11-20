import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-crear-bufete-abogado',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './crear_bufete-abogado.html',
    styleUrls: ['./crear_bufete-abogado.css']
})
export class CrearBufeteAbogado implements OnInit {

    private apiUrl = 'http://52.3.15.55:7000/bufetes';
    codigoAcceso: string = '';
    previewUrl: string | ArrayBuffer | null = null;
    selectedFile: File | null = null;

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
    }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }

    crear(): void {
        console.log('Crear bufete clicked');
        // Implement API call here
        this.router.navigate(['/abogado/mi-bufete']);
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            console.log('File selected:', file.name);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target?.result || null;
            };
            reader.readAsDataURL(file);
        }
    }
}
