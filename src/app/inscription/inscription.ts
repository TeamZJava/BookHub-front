import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class Inscription {
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  motDePasse = '';
  confirmMotDePasse = '';
  showPassword = false;
  showConfirm = false;
  cgAcceptees = false;
  erreur = '';

  onSubmit() {
    this.erreur = '';

    if (this.motDePasse !== this.confirmMotDePasse) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }
    if (!this.cgAcceptees) {
      this.erreur = 'Veuillez accepter les conditions générales.';
      return;
    }
    console.log('Inscription :', this.email);
  }
}
