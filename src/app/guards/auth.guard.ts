import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthState } from '../state/auth.state';

export const authGuard: CanActivateFn = (route, state) => {
    const authState = inject(AuthState);
    const router = inject(Router);

    // Verificar si está autenticado y el token es válido
    if (authState.isAuthValid()) {
        return true;
    }

    // Si no está autenticado, redirigir al login
    console.warn('Acceso denegado. Redirigiendo al login...');
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};
