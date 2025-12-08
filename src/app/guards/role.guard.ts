import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthState } from '../state/auth.state';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authState = inject(AuthState);
    const router = inject(Router);

    const allowedRoles = route.data['roles'] as number[];

    const userRole = authState.userRole;

    if (userRole && allowedRoles.includes(userRole)) {
        return true;
    }

    console.warn('Acceso denegado por falta de permisos.');

    if (userRole === 1) {
        router.navigate(['/usuario/home']);
    } else if (userRole === 2) {
        router.navigate(['/abogado/foro']);
    } else if (userRole === 3) {
        router.navigate(['/admin']);
    } else {
        router.navigate(['/login']);
    }

    return false;
};