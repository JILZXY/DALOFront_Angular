import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageAdapter {
  
 
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error al guardar en localStorage: ${key}`, error);
    }
  }


  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error al leer de localStorage: ${key}`, error);
      return null;
    }
  }

  
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al remover de localStorage: ${key}`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar localStorage', error);
    }
  }

  /**
   * Verificar si existe una clave
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}