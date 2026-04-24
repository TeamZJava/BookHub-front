import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BookPage } from '../models/book-page.model';
import { BookDetailDTO } from '../models/book-detail.model';
@Injectable({ providedIn: 'root' })
export class BookService {
  // HttpClient : permet de faire des requêtes HTTP vers le back
  private http = inject(HttpClient);

  // URL de base de l'API des livres
  private readonly apiUrl = 'http://localhost:8080/api/books';

  // Récupère la liste des livres en mode catalogue avec filtres
  // - page : pagination pour la page actuelle et size : le nombre d'éléments par page
  // - search : titre / auteur / isbn
  // - category : filtre catégorie
  // - available : '' (tous) | 'true' (disponible) | 'false' (indisponible)
  // - sort et direction : tri par titre ou date ajout
  getBooks(
    page: number,
    size: number,
    search: string,
    category: string,
    available: string,
    sort: string,
    direction: string,
  ) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);

    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    if (available) params = params.set('available', available);

    return this.http.get<BookPage>(this.apiUrl, { params });
  }

  // Récupère le détail d'un livre par son id
  getBookDetail(id: number) {
    return this.http.get<BookDetailDTO>(`${this.apiUrl}/${id}`);
  }

  // Récupère la liste des catégories pour le filtre du catalogue
  getCategories() {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  ajouterLivre(livre: object) {
    return this.http.post(this.apiUrl, livre);
  }

  // Supprime un livre (réservé librarian et admin aussi?))
  deleteBook(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Envoie une note 1 à 5 sur un livre
  rateBook(bookId: number, note: number) {
    const params = new HttpParams().set('note', note.toString());
    return this.http.post(`${this.apiUrl}/${bookId}/ratings`, null, { params, responseType: 'text' });
  }

  // Ajoute un commentaire sur un livre
  addComment(bookId: number, comment: string) {
    return this.http.post(`${this.apiUrl}/${bookId}/comments`, { comment }, { responseType: 'text' });
  }

  // Signale un commentaire comme malveillant
  signalerCommentaire(bookId: number, commentId: number) {
    return this.http.put(`${this.apiUrl}/${bookId}/comments/${commentId}/signaler`, null, { responseType: 'text' });
  }

  // Récupère tous les commentaires signalés
  getCommentairesSignales() {
    return this.http.get<any[]>(`${this.apiUrl}/comments/signales`);
  }

  // Supprime un commentaire
  supprimerCommentaire(commentId: number) {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, { responseType: 'text' });
  }
}
