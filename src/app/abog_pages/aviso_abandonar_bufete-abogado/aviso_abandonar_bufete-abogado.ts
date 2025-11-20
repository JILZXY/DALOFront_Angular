import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-aviso-abandonar-bufete-abogado',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './aviso_abandonar_bufete-abogado.html',
    styleUrls: ['./aviso_abandonar_bufete-abogado.css']
})
export class AvisoAbandonarBufeteAbogado {

    constructor(private router: Router) { }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }
}
