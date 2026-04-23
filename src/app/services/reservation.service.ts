import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReservationDTO } from '../models/reservation-dto.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/reservations';

  // Réserver un livre (envoie le bookId en paramètre)
  // responseType: 'text' évite une erreur de parsing JSON si le back retourne du texte brut ou un MessageResponse
  reserve(bookId: number) {
    return this.http.post(this.apiUrl, null, {
      params: new HttpParams().set('bookId', bookId.toString()),
      responseType: 'text'
    });
  }

  // Réservations en cours de l'utilisateur connecté
  getMyReservations() {
    return this.http.get<ReservationDTO[]>(`${this.apiUrl}/my`);
  }
}
