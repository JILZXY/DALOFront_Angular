import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection',
  standalone: true,
  templateUrl: './selection.html.html',
  styleUrls: ['./selection.html.css']
})
export class SelectionHtml {

  constructor(private router: Router) {}

  irRegistroUsuario(): void {
    this.router.navigate(['/login/registro-usuario']);
  }

  irRegistroAbogado(): void {
    this.router.navigate(['/login/registro-usuario']);
  }
}