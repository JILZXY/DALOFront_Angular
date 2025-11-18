
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SpotifyAuthAdapter } from '../infraestructure/adapters/spotify-auth.adapter';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable del token
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  // Observable del estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Observable del error
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  private refreshIntervalId: any = null;

  constructor(private spotifyAuthAdapter: SpotifyAuthAdapter) {
    console.log('📌 AuthService construido');
  }

 
  initializeToken(): void {
    console.log('🔑 AuthService.initializeToken() ejecutándose...');
    
    // Verificar si hay token válido en storage
    const storedToken = this.getTokenFromStorage();
    
    if (storedToken && !this.isTokenExpired()) {
      console.log('✅ Token válido encontrado en storage');
      this.tokenSubject.next(storedToken);
      this.isAuthenticatedSubject.next(true);
      this.errorSubject.next(null);
      this.startAutoRefresh();
      return;
    }

    // Si no hay token o está expirado, solicitar uno nuevo
    console.log('🌐 Token no válido, solicitando nuevo a Spotify...');
    this.requestNewToken();
  }

  /**
   * Solicitar nuevo token a Spotify
   */
  private requestNewToken(): void {
    this.spotifyAuthAdapter.getToken().subscribe({
      next: (response: any) => {
        console.log('✅ Token obtenido de Spotify:', response.access_token);
        
        const token = response.access_token;
        const expiresIn = response.expires_in;
        
        // Guardar en storage
        this.saveTokenToStorage(token, expiresIn);
        
        // Actualizar observables
        this.tokenSubject.next(token);
        this.isAuthenticatedSubject.next(true);
        this.errorSubject.next(null);
        
        console.log('💾 Token guardado en storage');
        console.log('⏰ Token expira en:', expiresIn, 'segundos');
        
        // Iniciar auto-refresh
        this.startAutoRefresh();
      },
      error: (error) => {
        console.error('❌ Error obteniendo token de Spotify:', error);
        
        const errorMsg = error.error?.error_description || 
                        error.message || 
                        'Error desconocido';
        
        this.tokenSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.errorSubject.next(errorMsg);
      }
    });
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    const token = this.tokenSubject.value;
    console.log('🔑 getToken() retorna:', token ? '***' : null);
    return token;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    const isAuth = this.isAuthenticatedSubject.value;
    console.log('🔐 isAuthenticated():', isAuth);
    return isAuth;
  }

  /**
   * Guardar token en LocalStorage
   */
  private saveTokenToStorage(token: string, expiresIn: number): void {
    const expiryTime = new Date().getTime() + (expiresIn * 1000);
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_token_expiry', expiryTime.toString());
  }

  /**
   * Obtener token del storage
   */
  private getTokenFromStorage(): string | null {
    const token = localStorage.getItem('spotify_access_token');
    console.log('💾 getTokenFromStorage():', token ? '***' : null);
    return token;
  }

  /**
   * Verificar si el token está expirado
   */
  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (!expiry) {
      console.log('⏰ isTokenExpired(): No hay expiry en storage');
      return true;
    }
    
    const expiryTime = parseInt(expiry, 10);
    const now = new Date().getTime();
    const isExpired = now > expiryTime;
    
    const msUntilExpiry = expiryTime - now;
    const minutesUntilExpiry = Math.floor(msUntilExpiry / 60000);
    
    console.log(`⏰ isTokenExpired(): ${isExpired} (expira en ${minutesUntilExpiry} minutos)`);
    
    return isExpired;
  }

  /**
   * Iniciar auto-refresh del token
   */
  private startAutoRefresh(): void {
    console.log('🔄 Iniciando auto-refresh...');
    
    // Limpiar interval anterior si existe
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
    
    // Verificar cada minuto si el token va a expirar
    this.refreshIntervalId = setInterval(() => {
      const expiry = localStorage.getItem('spotify_token_expiry');
      
      if (!expiry) {
        console.log('⚠️ Auto-refresh: No hay expiry en storage');
        this.requestNewToken();
        return;
      }
      
      const expiryTime = parseInt(expiry, 10);
      const now = new Date().getTime();
      const timeUntilExpiry = expiryTime - now;
      
      // Si expira en menos de 5 minutos, renovar
      if (timeUntilExpiry < 5 * 60 * 1000) {
        console.log('🔄 Auto-refresh: Token próximo a expirar, renovando...');
        this.requestNewToken();
      }
    }, 60000); // Cada 60 segundos
  }

  /**
   * Limpiar recursos
   */
  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }
}