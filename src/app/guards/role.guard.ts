import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthState } from '../state/auth.state';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authState = inject(AuthState);
    const router = inject(Router);

    // Obtener roles permitidos de la configuración de la ruta
    const allowedRoles = route.data['roles'] as number[];

    // Verificar si el usuario tiene alguno de los roles permitidos
    const userRole = authState.userRole;

    if (userRole && allowedRoles.includes(userRole)) {
        return true;
    }

    // Si no tiene permiso, redirigir según su rol
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