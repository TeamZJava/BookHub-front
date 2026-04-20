import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  // HttpClient : permet de faire des requêtes HTTP vers le back
  private http = inject(HttpClient);

  // URL de base de l'API des favoris
  private readonly apiUrl = 'http://localhost:8080/api/favorites';

  // Récupère tous les livres favoris de l'user
  getFavorites() {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // Ajoute un livre en favori (par son id)
  addFavorite(bookId: number) {
    return this.http.post<void>(`${this.apiUrl}/${bookId}`, {});
  }

  // Supprime un livre des favoris avec son id
  removeFavorite(bookId: number) {
    return this.http.delete<void>(`${this.apiUrl}/${bookId}`);
  }

  // Vérifie si un livre est en favori
  isFavorite(bookId: number) {
    return this.http.get<boolean>(`${this.apiUrl}/check/${bookId}`);
  }
}
