import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/register-request.model';
import { RegisterResponse } from '../models/register-response.model';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';

// @Injectable Angular peut injecter ce service dans d'autres classes
// providedIn: 'root' = une seule instance partagée dans toute l'application
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL de base de l'API back Spring Boot
  private apiUrl = 'http://localhost:8080/api/auth';

  // HttpClient injecté automatiquement par Angular
  // c'est lui qui permet de faire des requêtes HTTP
  constructor(private http: HttpClient) {}

  // Envoie une requête POST à /api/auth/register avec les données du formulaire
  // Observable<RegisterResponse> = la réponse sera reçue de manière asynchrone
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  //Envoie une requête POST à /api/auth/login avec email et mot de passe
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  // Vérifie si l'utilisateur est connecté (token présent dans le navigateur)
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Sauvegarde le token JWT dans le localStorage
  // + extrait le rôle depuis le token pour l'affichage dans le navbar par exemple
  saveToken(token: string) {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('role', payload.role ?? '');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
