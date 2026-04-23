import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserResponse } from '../models/user-response.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit {

  listeUtilisateurs: UserResponse[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.listeUtilisateurs = data,
      error: () => this.listeUtilisateurs = []
    });
  }

  changerRole(userId: number, roleActuel: string): void {
    const nouveauRole = prompt(
      `Nouveau rôle pour l'utilisateur #${userId}\nActuel : ${roleActuel}\n\nChoisir : USER / LIBRARIAN / ADMIN`
    );
    if (!nouveauRole) return;
    this.userService.setRole(userId, nouveauRole.toUpperCase()).subscribe({
      next: () => this.chargerUtilisateurs(),
      error: () => alert('Rôle invalide ou erreur serveur.')
    });
  }

  supprimerUtilisateur(userId: number): void {
    if (!confirm(`Supprimer définitivement l'utilisateur #${userId} ?`)) return;
    this.userService.deleteUser(userId).subscribe({
      next: () => this.chargerUtilisateurs(),
      error: () => alert('Erreur lors de la suppression.')
    });
  }
}
