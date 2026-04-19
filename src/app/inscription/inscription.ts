import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { RegisterRequest } from '../models/register-request.model';
import { AuthService } from '../auth';

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

  // injection du service HTTP et du router pour la navigation
  constructor(private authService: AuthService, private router: Router) {}

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

    // on construit l'objet à envoyer au back selon le modèle RegisterRequest
    const data: RegisterRequest = {
      email: this.email,
      password: this.motDePasse,
      firstName: this.prenom,
      lastName: this.nom,
      phone: this.telephone || undefined,
      tosAcceptationDate: new Date().toISOString() // date d'acceptation des CGU
    };

    // on appelle le back et on s'abonne à la réponse
    this.authService.register(data).subscribe({
      next: () => {
        // inscription réussie → on redirige vers la page de connexion
        this.router.navigate(['/connexion']);
      },
      error: (err) => {
        // le back renvoie 400 si les données sont invalides (email déjà utilisé, etc.)
        if (err.status === 400) {
          this.erreur = 'Email déjà utilisé ou données invalides.';
        } else {
          this.erreur = 'Une erreur est survenue, veuillez réessayer.';
        }
      }
    });
  }
}
