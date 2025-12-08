import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthState } from '../state/auth.state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authState = inject(AuthState);
    const router = inject(Router);

    const token = authState.token;

    let clonedRequest = req;
    if (token) {
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

    return next(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn('Error 401: No autorizado. Cerrando sesión...');
                authState.clearAuth();
                router.navigate(['/login']);
            }

            if (error.status === 403) {
                console.warn('Error 403: Acceso prohibido.');
               
            }

            return throwError(() => error);
        })
    );
};