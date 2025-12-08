import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-bufete-codigo-abogado',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './bufete_codigo-abogado.html',
    styleUrls: ['./bufete_codigo-abogado.css']
})
export class BufeteCodigoAbogado {
    codigo: string = '';

    constructor(private router: Router) { }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }

    ingresarCodigo(): void {
        if (this.codigo.trim()) {
            console.log('Código ingresado:', this.codigo);
       
            this.router.navigate(['/abogado/mi-bufete']);
        }
    }
}
