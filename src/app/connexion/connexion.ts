import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css'
})
export class Connexion {
  email = '';
  motDePasse = '';
  showPassword = false;
  erreur = false;

  onSubmit() {
    if (!this.email || !this.motDePasse) {
      this.erreur = true;
    } else {
      this.erreur = false;
      console.log('Connexion avec :', this.email);
    }
  }
}
