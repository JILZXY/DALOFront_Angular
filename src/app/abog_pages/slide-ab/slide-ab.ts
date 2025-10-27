import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-slide-ab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './slide-ab.html',
  styleUrls: ['./slide-ab.css']
})
export class SlideAb implements OnInit, OnDestroy {
  isOpen = false;
  private sidebarListener: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.sidebarListener = (event: CustomEvent) => {
      this.isOpen = event.detail;
    };
    window.addEventListener('toggle-sidebar', this.sidebarListener);
  }

  ngOnDestroy() {
    if (this.sidebarListener) {
      window.removeEventListener('toggle-sidebar', this.sidebarListener);
    }
  }

  closeSidebar() {
    this.isOpen = false;
    window.dispatchEvent(new CustomEvent('toggle-sidebar', { detail: false }));
  }

  logout(event: Event) {
    event.preventDefault();
    
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    
    this.closeSidebar();
    
    this.router.navigate(['/login']);
    
    
  }
}