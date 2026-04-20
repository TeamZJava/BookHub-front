import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  // injections :Auth pour connexion / Loan pour retard / Router pour la navigation
  private authService = inject(AuthService);
  private loanService = inject(LoanService);
  private router = inject(Router);

  // true = l'utilisateur a au moins un emprunt en retard (dot rouge)
  isLate = false;

  // Sert dans le HTML pour afficher les liens selon la connexion
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Méthode appelé automatiquement au chargement du composant
  // On demande au back si l'user est en retard (dot voyant rouge si true)
  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loanService.isLate().subscribe({
        next: (result) => {
          this.isLate = result;
        },
        error: () => {
          this.isLate = false;
        },
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
