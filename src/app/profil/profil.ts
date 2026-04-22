import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserResponse } from '../models/user-response.model';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class Profil implements OnInit {

  // Données affichées dans le formulaire
  utilisateur: UserResponse | null = null;
  userId: number | null = null;

  // Champs du formulaire d'édition (copie des données pour ne pas modifier l'affichage en direct)
  form = { email: '', firstName: '', lastName: '', phone: '' };

  // Champs du formulaire de changement de mot de passe
  mdpForm = { ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' };

  // États d'affichage
  modeEdition = false;
  modeMotDePasse = false;
  confirmerSuppression = false;

  // Messages retour utilisateur
  messageSucces = '';
  messageErreur = '';
  messageErreurMdp = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    // getMe() utilise le token JWT via l'intercepteur pour identifier l'utilisateur côté back
    this.userService.getMe().subscribe({
      next: (data) => {
        this.utilisateur = data;
        this.userId = data.id;
        // On initialise le formulaire avec les données reçues
        this.form = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone ?? ''
        };
      },
      error: () => {
        // Si le token est invalide ou expiré, le back renvoie 401/403 → retour connexion
        this.router.navigate(['/connexion']);
      }
    });
  }

  activerEdition(): void {
    this.modeEdition = true;
    this.messageSucces = '';
    this.messageErreur = '';
  }

  annulerEdition(): void {
    // Remet le formulaire à l'état initial sans sauvegarder
    if (this.utilisateur) {
      this.form = {
        email: this.utilisateur.email,
        firstName: this.utilisateur.firstName,
        lastName: this.utilisateur.lastName,
        phone: this.utilisateur.phone ?? ''
      };
    }
    this.modeEdition = false;
  }

  sauvegarderProfil(): void {
    this.userService.updateUser({
      ...this.form,
      // Pas de changement de mot de passe ici → chaînes vides
      oldPassword: '',
      password: ''
    }).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        this.utilisateur = { ...this.utilisateur!, ...data };
        this.modeEdition = false;
        this.messageSucces = 'Profil mis à jour avec succès.';
        this.messageErreur = '';
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la mise à jour du profil.';
      }
    });
  }

  changerMotDePasse(): void {
    if (this.mdpForm.nouveauMotDePasse !== this.mdpForm.confirmation) {
      this.messageErreurMdp = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.userService.updateUser({
      ...this.form,
      oldPassword: this.mdpForm.ancienMotDePasse,
      password: this.mdpForm.nouveauMotDePasse
    }).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        this.modeMotDePasse = false;
        this.mdpForm = { ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' };
        this.messageSucces = 'Mot de passe modifié avec succès.';
        this.messageErreurMdp = '';
      },
      error: () => {
        this.messageErreurMdp = 'Ancien mot de passe incorrect.';
      }
    });
  }

  supprimerCompte(): void {
    this.userService.deleteUser(this.userId!).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/connexion']);
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la suppression du compte.';
        this.confirmerSuppression = false;
      }
    });
  }
}
