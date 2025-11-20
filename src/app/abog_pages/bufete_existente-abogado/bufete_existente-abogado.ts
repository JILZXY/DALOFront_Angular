import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-bufete-existente-abogado',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bufete_existente-abogado.html',
    styleUrls: ['./bufete_existente-abogado.css']
})
export class BufeteExistenteAbogado {

    constructor(private router: Router) { }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }
}
