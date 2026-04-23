import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LoanService } from '../services/loan.service';
import { BookService } from '../services/book.service';
import { UserService } from '../services/user.service';
import { LoanDTO } from '../models/loan-dto.model';

@Component({
  selector: 'app-dashboard-librarian',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard-librarian.html',
  styleUrl: './dashboard-librarian.css',
})
export class DashboardLibrarian implements OnInit {

  totalLivres = 0;
  empruntsActifs = 0;
  retards = 0;
  totalUtilisateurs = 0;
  listeRetards: any[] = [];
  listeEmprunts: any[] = [];
  topLivres: any[] = [];

  constructor(
    private router: Router,
    private loanService: LoanService,
    private bookService: BookService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.chargerEmprunts();
    this.chargerLivres();
    this.chargerUtilisateurs();
  }

  chargerEmprunts(): void {
    this.loanService.getAllLoans().subscribe({
      next: (emprunts) => {
        this.listeEmprunts = emprunts.filter(e => e.status === 'ACTIVE' || e.status === 'OVERDUE');
        this.listeRetards = this.listeEmprunts.filter(e => this.estEnRetard(e));
        this.empruntsActifs = this.listeEmprunts.length;
        this.retards = this.listeRetards.length;
      }
    });
  }

  estEnRetard(emprunt: LoanDTO): boolean {
    return emprunt.status === 'OVERDUE' || new Date(emprunt.dueDate).getTime() < Date.now();
  }

  chargerLivres(): void {
    this.bookService.getBooks(0, 1, '', '', '', 'title', 'asc').subscribe({
      next: (page) => this.totalLivres = page.totalElements
    });
  }

  chargerUtilisateurs(): void {
    this.userService.getAllUsers().subscribe({
      next: (utilisateurs) => this.totalUtilisateurs = utilisateurs.length
    });
  }

  relancerUtilisateur(empruntId: number) {
    alert(`Rappel envoyé (simulation) pour l'emprunt #${empruntId}`);
    //TODO: envoyé un email de rappel à l'user concerné
  }

  enregistrerRetour() {
    const empruntId = Number(prompt("ID de l'emprunt à clore :"));
    if (!empruntId) return;
    this.loanService.returnBook(empruntId).subscribe({
      next: () => { alert(`Emprunt #${empruntId} clôturé.`); this.chargerEmprunts(); },
      error: () => alert('Erreur lors du retour.')
    });
  }

  ajouterLivre()    { this.router.navigate(['/catalogue']);
    //TODO: faire formulaire pour ajouter un nouveau livre dans le catalogue
   }
  gererCatalogue()  { this.router.navigate(['/catalogue']); }
  gererUtilisateurs() { this.router.navigate(['/dashboard-admin']); 
    //TODO: faire dashboard admin
  }
}
