import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SpotifySearchAdapter } from '../infraestructure/spotify-search.adapter';
import { SearchResult, SpotifySearchResponse } from '../domain/models/search-result.model';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Observable de búsqueda
  private searchSubject = new BehaviorSubject<string>('');
  public search$ = this.searchSubject.asObservable();

  // Resultados de búsqueda
  private resultsSubject = new BehaviorSubject<SearchResult>({
    tracks: [],
    artists: [],
    albums: []
  });
  public results$ = this.resultsSubject.asObservable();

  // Estado de carga
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Mensajes de error
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private spotifySearchAdapter: SpotifySearchAdapter) {
    this.initializeSearch();
  }

  /**
   * Inicializar la búsqueda con debounce
   */
  private initializeSearch(): void {
    this.search$
      .pipe(
        // Esperar 500ms después de cada cambio
        debounceTime(500),
        
        // Ignorar valores duplicados
        distinctUntilChanged(),
        
        // Validar mínimo 2 caracteres
        switchMap(query => {
          // Limpiar error anterior
          this.errorSubject.next(null);

          if (query.trim().length < 2) {
            // Si tiene < 2 caracteres, mostrar resultados vacíos
            this.resultsSubject.next({
              tracks: [],
              artists: [],
              albums: []
            });
            return of(null);
          }

          // Mostrar loading
          this.loadingSubject.next(true);

          // Hacer la búsqueda
          return this.spotifySearchAdapter.search(query).pipe(
            map(response => {
              this.loadingSubject.next(false);
              return response;
            }),
            catchError(error => {
              this.loadingSubject.next(false);
              this.errorSubject.next('Error al buscar. Intenta de nuevo.');
              console.error('Error en búsqueda:', error);
              return of(null);
            })
          );
        })
      )
      .subscribe(response => {
        if (response) {
          const result = this.mapSearchResponse(response);
          this.resultsSubject.next(result);
        }
      });
  }

  /**
   * Realizar búsqueda (desde componente)
   */
  public performSearch(query: string): void {
    this.searchSubject.next(query);
  }

  /**
   * Mapear respuesta de Spotify a nuestro modelo
   */
  private mapSearchResponse(response: SpotifySearchResponse): SearchResult {
    return {
      tracks: response.tracks?.items || [],
      artists: response.artists?.items || [],
      albums: response.albums?.items || []
    };
  }

  /**
   * Obtener el query actual
   */
  public getCurrentQuery(): string {
    return this.searchSubject.value;
  }

  /**
   * Limpiar búsqueda
   */
  public clearSearch(): void {
    this.searchSubject.next('');
    this.resultsSubject.next({
      tracks: [],
      artists: [],
      albums: []
    });
    this.errorSubject.next(null);
  }

  /**
   * Verificar si hay resultados
   */
  public hasResults(): Observable<boolean> {
    return this.results$.pipe(
      map(results => {
        return results.tracks.length > 0 || 
               results.artists.length > 0 || 
               results.albums.length > 0;
      })
    );
  }

  /**
   * Contar total de resultados
   */
  public getResultCount(): Observable<number> {
    return this.results$.pipe(
      map(results => {
        return results.tracks.length + 
               results.artists.length + 
               results.albums.length;
      })
    );
  }
}