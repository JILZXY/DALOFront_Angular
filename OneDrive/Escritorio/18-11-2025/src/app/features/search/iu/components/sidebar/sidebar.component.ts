import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar">
      <!-- Logo -->
      <div class="logo">
        <span class="logo-icon">🎵</span>
        <span class="logo-text">Spotify Clone</span>
      </div>

      <!-- Navegación principal -->
      <nav class="nav-main">
        <h3 class="nav-title">MENÚ</h3>
        
        <ul class="nav-list">
          <li>
            <a 
              routerLink="/dashboard" 
              routerLinkActive="active"
              class="nav-link"
            >
              🏠 Inicio
            </a>
          </li>
        </ul>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <p class="version">v1.0.0</p>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: #0f172a;
      border-right: 1px solid rgba(148, 163, 184, 0.2);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 20px 0;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
    }

    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.3);
      border-radius: 3px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: rgba(148, 163, 184, 0.5);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 20px;
      margin-bottom: 30px;
    }

    .logo-icon {
      font-size: 28px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #1db954;
    }

    .nav-main {
      flex: 1;
      padding: 0 12px;
      margin-bottom: 20px;
    }

    .nav-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 8px 12px 8px;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-list li {
      margin-bottom: 8px;
    }

    .nav-link {
      display: block;
      padding: 12px 12px;
      color: #cbd5e1;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.3s ease;
      font-size: 14px;
      cursor: pointer;
    }

    .nav-link:hover {
      background: rgba(29, 185, 84, 0.1);
      color: #1db954;
    }

    .nav-link.active {
      background: rgba(29, 185, 84, 0.2);
      color: #1db954;
      font-weight: 600;
      border-left: 3px solid #1db954;
      padding-left: 9px;
    }

    .sidebar-footer {
      padding: 0 20px;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
      padding-top: 20px;
    }

    .version {
      font-size: 11px;
      color: #64748b;
      margin: 0;
    }
  `]
})
export class SidebarComponent {
}