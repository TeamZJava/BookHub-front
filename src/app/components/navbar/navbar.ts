import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
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
  authService = inject(AuthService);
  private loanService = inject(LoanService);
  private router = inject(Router);

  // true = l'utilisateur a au moins un emprunt en retard (dot rouge)
  isLate = false;

  // true = dark mode actif
  isDark = false;

  // Sert dans le HTML pour afficher les liens selon la connexion
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

ngOnInit() {
  // Restaure le thème sauvegardé au rechargement
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    this.isDark = true;
    document.body.classList.add('dark');
  }

   // Vérifie les emprunts en retard à chaque changement de route (dont après login)
  this.router.events.subscribe(event => {
    if (!(event instanceof NavigationEnd)) return;
    if (this.isLoggedIn()) {
      this.loanService.isLate().subscribe({
        next: (result) => { this.isLate = result; },
        error: () => { this.isLate = false; },
      });
    } else {
      this.isLate = false;
    }
  });
}

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
