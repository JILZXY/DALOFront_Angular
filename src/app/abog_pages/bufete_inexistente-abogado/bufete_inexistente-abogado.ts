import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-bufete-inexistente-abogado',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bufete_inexistente-abogado.html',
    styleUrls: ['./bufete_inexistente-abogado.css']
})
export class BufeteInexistenteAbogado implements OnInit {


    private apiUrl = 'http://your-api-endpoint'; // Placeholder for API endpoint

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
        // Ready for API connection
    }

    volver(): void {
        this.router.navigate(['/abogado/opciones-bufete']);
    }
}
