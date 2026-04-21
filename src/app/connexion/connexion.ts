import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth';
import { LoginRequest } from '../models/login-request.model';

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

  // injection du service HTTP et du router pour la navigation
  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit() {
    this.erreur = false;

    // vérification des champs avant d'appeler le back
    if (!this.email || !this.motDePasse) {
      this.erreur = true;
      return;
    }

    const data: LoginRequest = {
      email: this.email,
      password: this.motDePasse
    };

    this.authService.login(data).subscribe({
      next: (reponse) => {
        localStorage.setItem('token', reponse.token);
       // this.router.navigate(['/accueil']).then(); -> then() tout seul en suffit pas
        this.router.navigate(['/catalogue']).then(() => {
          this.isLoading = false;
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.erreur = true;
        } else {
          this.erreur = true;
        }
      }
    });
  }
}
