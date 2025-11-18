import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-error',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-error.component.html',
})
export class AuthErrorComponent {}
