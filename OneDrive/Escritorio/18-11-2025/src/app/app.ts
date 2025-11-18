import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,          
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']   
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {
    console.log('📌 AppComponent construido');
  }

  ngOnInit(): void {
    console.log('🚀 AppComponent inicializando...');
    this.authService.initializeToken();
  }
}
