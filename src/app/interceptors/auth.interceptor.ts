import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthState } from '../state/auth.state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authState = inject(AuthState);
    const router = inject(Router);

    // Obtener token del state
    const token = authState.token;

    // Si hay token, agregarlo al header
    let clonedRequest = req;
    if (token) {
        // Verificar si el token está expirado antes de enviarlo
        if (authState.isTokenExpired()) {
            console.warn('Token expirado. Cerrando sesión...');
            authState.clearAuth();
            router.navigate(['/login']);
            return throwError(() => new Error('Token expirado'));
        }

        clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // Manejar errores de autenticación
    return next(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            // Si el servidor responde 401 (No autorizado)
            if (error.status === 401) {
                console.warn('Error 401: No autorizado. Cerrando sesión...');
                authState.clearAuth();
                router.navigate(['/login']);
            }

            // Si el servidor responde 403 (Prohibido)
            if (error.status === 403) {
                console.warn('Error 403: Acceso prohibido.');
                // Opcionalmente redirigir a página de "acceso denegado"
                // router.navigate(['/acceso-denegado']);
            }

            return throwError(() => error);
        })
    );
};