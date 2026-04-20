import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LoanService {
  // HttpClient : permet de faire des requêtes HTTP vers le back
  private http = inject(HttpClient);

  // URL de base de l'API des emprunts
  private readonly apiUrl = 'http://localhost:8080/api/loans';

  // Emprunter un livre (envoie le bookId en paramètre)
  borrow(bookId: number) {
    return this.http.post<void>(this.apiUrl, null, {
      params: new HttpParams().set('bookId', bookId.toString()),
    });
  }

  // à compléter pour rendre visible les emprunts en cours ou en retard dans le dashboard...

  // Demande au back si l'utilisateur connecté a un retard pour déterminer la couleur du voyant dot
  isLate() {
    return this.http.get<boolean>(`${this.apiUrl}/is-late`);
  }
}
