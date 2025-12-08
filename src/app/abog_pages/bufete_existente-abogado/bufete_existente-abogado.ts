import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BufeteState } from '../../state/bufete.state';
import { Observable } from 'rxjs';
import { Bufete } from '../../models';

@Component({
    selector: 'app-bufete-existente-abogado',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bufete_existente-abogado.html',
    styleUrls: ['./bufete_existente-abogado.css']
})
export class BufeteExistenteAbogado implements OnInit {

    bufetes$: Observable<Bufete[]>;

    constructor(
        private router: Router,
        private bufeteState: BufeteState
    ) { 
        this.bufetes$ = this.bufeteState.bufetes$;
    }

    ngOnInit(): void {
        this.bufeteState.loadBufetes();
    }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }

    unirse(bufete: Bufete): void {
        if(confirm(`¿Deseas enviar una solicitud para unirte a ${bufete.nombre}?`)) {
            this.bufeteState.unirseBufete(bufete.id).subscribe({
                next: () => alert('Solicitud enviada correctamente'),
                error: (err: any) => alert('Error al enviar solicitud: ' + (err.error?.message || err.message))
            });
        }
    }
}
