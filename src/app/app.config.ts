import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http'; // permet de faire des requêtes HTTP

import { routes } from './app.routes';

// Interceptor HTTP : ajoute automatiquement "Authorization: Bearer <token>"
// sur toutes les requêtes vers le back quand l'utilisateur est connecté.
const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  // On n'ajoute pas le token sur les routes d'authentification
  // (login / register n'ont pas besoin d'être authentifiées)
  const isAuthRoute = req.url.includes('/api/auth/');
  if (token && !isAuthRoute) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    // capture les erreurs globales du navigateur
    provideBrowserGlobalErrorListeners(),

    // active la détection de changement via Zone.js (mode "classique")
    // utile pour que l'UI se rafraîchisse automatiquement après les appels HTTP
    provideZoneChangeDetection({ eventCoalescing: true }),

    // enregistre les routes de l'application (connexion, inscription, catalogue...)
    provideRouter(routes),

    // active HttpClient pour toute l'application + active l'interceptor JWT
    // sans ça, les appels HTTP dans les services ne fonctionnent pas
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
