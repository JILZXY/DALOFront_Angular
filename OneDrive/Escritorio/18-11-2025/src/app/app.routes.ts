import { Routes } from '@angular/router';
import { authGuard } from './core/infraestructure/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/search/iu/page/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'track/:id',
    loadComponent: () => import('./features/track-detail/iu/pages/track-detail-page/track-detail-page.component')
      .then(m => m.TrackDetailPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth-error',
    loadComponent: () => import('./features/auth/iu/components/auth-error/auth-error.component')
      .then(m => m.AuthErrorComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];