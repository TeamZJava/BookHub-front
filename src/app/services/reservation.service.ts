import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  // HttpClient : permet de faire des requêtes HTTP vers le back
  private http = inject(HttpClient);

  // URL de base de l'API des réservations
  private readonly apiUrl = 'http://localhost:8080/api/reservations';

  // Réserver un livre (envoie le bookId en paramètre)
  reserve(bookId: number) {
    return this.http.post<void>(this.apiUrl, null, {
      params: new HttpParams().set('bookId', bookId.toString()),
    });
  }

  // à compléter : récpérer la liste des réservations de l'user pour son dashboard par exemple
}
