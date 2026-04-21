import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Connexion } from './connexion/connexion';
import { Inscription } from './inscription/inscription';
import { Catalogue } from './catalogue/catalogue';
import { BookDetail } from './book-detail/book-detail';
import { Favoris } from './favoris/favoris';
import { Dashboard } from './dashboard/dashboard';
import { Profil } from './profil/profil';

//Stockage sécurisé du token côté client
//Pour empêcher les utilisateurs non authentifiés d'accéder à certaines pages
const authGuard = () => {
  const token = localStorage.getItem('token');
  if (token) return true;
  inject(Router).navigate(['/connexion']);
  return false;
};

export const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  { path: 'connexion', component: Connexion },
  { path: 'inscription', component: Inscription },
  { path: 'catalogue', component: Catalogue, canActivate: [authGuard] },
  { path: 'books/:id', component: BookDetail, canActivate: [authGuard] },
  { path: 'favoris', component: Favoris, canActivate: [authGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'profil', component: Profil, canActivate: [authGuard] },
  { path: '**', redirectTo: 'connexion' },
];
