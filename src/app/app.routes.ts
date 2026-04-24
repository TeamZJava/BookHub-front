import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Connexion } from './connexion/connexion';
import { Inscription } from './inscription/inscription';
import { Catalogue } from './catalogue/catalogue';
import { BookDetail } from './book-detail/book-detail';
import { Favoris } from './favoris/favoris';
import { Dashboard } from './dashboard/dashboard';
import { DashboardLibrarian } from './dashboard-librarian/dashboard-librarian';
import { DashboardAdmin } from './dashboard-admin/dashboard-admin';
import { Profil } from './profil/profil';

//les guards pour la sécurite : stockage sécurisé du token côté client
//empêcher les utilisateurs non authentifiés d'accéder à certaines pages
const authGuard = () => {
  const token = localStorage.getItem('token');
  if (token) return true;
  inject(Router).navigate(['/connexion']);
  return false;
};

const librarianGuard = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token && role === 'LIBRARIAN') return true;
  inject(Router).navigate(['/connexion']);
  return false;
};

const adminGuard = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token && role === 'ADMIN') return true;
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
  { path: 'dashboard-librarian', component: DashboardLibrarian, canActivate: [librarianGuard] },
  { path: 'dashboard-admin', component: DashboardAdmin, canActivate: [adminGuard] },
  { path: 'profil', component: Profil, canActivate: [authGuard] },
  { path: '**', redirectTo: 'connexion' },
];
