import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BufeteState } from '../../state/bufete.state';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-mi-bufete-abogado',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mi_bufete-abogado.html',
    styleUrls: ['./mi_bufete-abogado.css']
})
export class MiBufeteAbogado implements OnInit {
    bufeteActual$: Observable<any>;
    solicitudes$: Observable<any[]>;
    selectedFilter: string = 'PENAL';

    constructor(
        private bufeteState: BufeteState,
        private router: Router
    ) { 
        this.bufeteActual$ = this.bufeteState.bufeteActual$;
        this.solicitudes$ = this.bufeteState.solicitudes$;
    }

    ngOnInit(): void {
        this.bufeteState.loadMisBufetes();
    }

    get filteredAbogados(): any[] {
         // Logic to filter abogados from bufeteActual
         // For now, return empty or mock if needed to avoid breaking template
         return []; 
    }

    setFilter(filter: string): void {
        this.selectedFilter = filter;
    }

    volver(): void {
        this.router.navigate(['/abogado/home']);
    }

    salirDelBufete(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }

    aprobarSolicitud(solicitudId: number): void {
        this.bufeteState.aprobarSolicitud(solicitudId).subscribe(() => alert('Solicitud aprobada'));
    }

    rechazarSolicitud(solicitudId: number): void {
        this.bufeteState.rechazarSolicitud(solicitudId).subscribe(() => alert('Solicitud rechazada'));
    }
}
