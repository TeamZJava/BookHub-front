import { Routes } from '@angular/router';
import { Connexion } from './connexion/connexion';
import { Inscription } from './inscription/inscription';
import { Catalogue } from './catalogue/catalogue';
import { BookDetail } from './book-detail/book-detail';
import { Favoris } from './favoris/favoris';
import { Dashboard } from './dashboard/dashboard';
import { Profil } from './profil/profil';

export const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  { path: 'connexion', component: Connexion },
  { path: 'inscription', component: Inscription },
  { path: 'catalogue', component: Catalogue },
  { path: 'books/:id', component: BookDetail },
  { path: 'favoris', component: Favoris },
  { path: 'dashboard', component: Dashboard  },
  { path: 'profil', component: Profil },
  { path: '**', redirectTo: 'connexion' }
];
