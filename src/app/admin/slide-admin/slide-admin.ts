import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-slide-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './slide-admin.html',
  styleUrls: ['./slide-admin.css']
})
export class SlideAdmin implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();

 

  constructor(private router: Router) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  closeSidebar() {
    this.closed.emit();
  }

  logout(event: Event) {
    event.preventDefault();
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.closeSidebar();
    this.router.navigate(['/login']);
  }
}