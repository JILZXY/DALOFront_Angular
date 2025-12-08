import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthState } from '../state/auth.state';

export const authGuard: CanActivateFn = (route, state) => {
    const authState = inject(AuthState);
    const router = inject(Router);

    if (authState.isAuthValid()) {
        return true;
    }

    console.warn('Acceso denegado. Redirigiendo al login...');
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};
