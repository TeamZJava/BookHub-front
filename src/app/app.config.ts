import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // permet de faire des requêtes HTTP
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // capture les erreurs globales du navigateur
    provideBrowserGlobalErrorListeners(),
    // enregistre les routes de l'application (connexion, inscription...)
    provideRouter(routes),
    // active HttpClient pour toute l'application
    // sans ça, les appels HTTP dans les services ne fonctionnent pas
    provideHttpClient()
  ]
};
