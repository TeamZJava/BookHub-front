import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/user-response.model';
import { UpdateUserRequest } from '../models/update-user-request.model';
import { UserUpdateResponse } from '../models/user-update-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Récupère le profil de l'utilisateur connecté via le token JWT (géré par l'intercepteur)
  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/my`);
  }
  
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  getUser(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  // Plus d'id dans l'URL — le back identifie l'utilisateur via le Principal (JWT)
  // Retourne un nouveau token si l'email a changé
  updateUser(data: UpdateUserRequest): Observable<UserUpdateResponse> {
    return this.http.put<UserUpdateResponse>(`${this.apiUrl}`, data);
  }

  setRole(id: number, role: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}/role`, null, { params: { role } });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
