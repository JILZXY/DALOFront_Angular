import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthState {
    private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
    public currentUser$: Observable<Usuario | null> = this.currentUserSubject.asObservable();

    private tokenSubject = new BehaviorSubject<string | null>(null);
    public token$: Observable<string | null> = this.tokenSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    constructor() {
        this.loadFromLocalStorage();
    }


    get currentUser(): Usuario | null {
        return this.currentUserSubject.value;
    }


    get token(): string | null {
        return this.tokenSubject.value;
    }


    get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }


    setAuth(token: string, usuario: Usuario): void {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(usuario));

        this.tokenSubject.next(token);
        this.currentUserSubject.next(usuario);
        this.isAuthenticatedSubject.next(true);
    }


    setUser(usuario: Usuario): void {
        localStorage.setItem('currentUser', JSON.stringify(usuario));
        this.currentUserSubject.next(usuario);
    }


    clearAuth(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');

        this.tokenSubject.next(null);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }


    private loadFromLocalStorage(): void {
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('currentUser');

        if (token && userJson) {
            try {
                const usuario = JSON.parse(userJson) as Usuario;
                this.tokenSubject.next(token);
                this.currentUserSubject.next(usuario);
                this.isAuthenticatedSubject.next(true);
            } catch (error) {
                console.error('Error al cargar usuario del localStorage:', error);
                this.clearAuth();
            }
        }
    }

    get userRole(): number | null {
        return this.currentUser?.rolId ?? null;
    }

    isCliente(): boolean {
        return this.userRole === 1;
    }


    isAbogado(): boolean {
        return this.userRole === 2;
    }


    isAdmin(): boolean {
        return this.userRole === 3;
    }

    isTokenExpired(): boolean {
        const token = this.token;
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp;

            if (!exp) return false;

            const now = Math.floor(Date.now() / 1000);
            return exp < now;
        } catch (error) {
            console.error('Error al verificar expiración del token:', error);
            return true;
        }
    }

  
    isAuthValid(): boolean {
        return this.isAuthenticated && !this.isTokenExpired();
    }
}