import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../services/loan.service';
import { BookService } from '../services/book.service';
import { UserService } from '../services/user.service';
import { LoanDTO } from '../models/loan-dto.model';

// fonction utilitaire pour créer un livre vide
function livreVide() {
  return {
    title: '', author: '', isbn: '', description: '', category: '', coverUrl: '',
    totalCopies: 1, availableCopies: 1,
  };
}

@Component({
  selector: 'app-dashboard-librarian',
  standalone: true,
  imports: [DatePipe, FormsModule],
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
  commentairesSignales: any[] = [];

  // Formulaire ajout livre
  afficherFormulaire = false;
  nouveauLivre = livreVide();

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
    this.chargerSignalements();
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

  chargerSignalements(): void {
    this.bookService.getCommentairesSignales().subscribe({
      next: (data) => this.commentairesSignales = data,
      error: () => this.commentairesSignales = []
    });
  }

  supprimerCommentaire(commentId: number): void {
    this.bookService.supprimerCommentaire(commentId).subscribe({
      next: () => this.chargerSignalements(),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  ajouterLivre(): void {
    this.afficherFormulaire = true;
  }

  soumettreFormulaire(): void {
    const n = this.nouveauLivre;
    const titre = (n.title || '').trim();
    const auteur = (n.author || '').trim();
    const isbn = (n.isbn || '').trim();
    if (!titre || !auteur || !isbn) {
      alert('Titre, auteur et ISBN sont obligatoires.');
      return;
    }
    const copies = Math.max(1, Math.floor(Number(n.totalCopies)) || 1);
    const livrePourApi = {
      title: titre,
      author: auteur,
      isbn,
      category: (n.category || '').trim(),
      description: (n.description || '').trim(),
      coverUrl: (n.coverUrl || '').trim(),
      totalCopies: copies,
      availableCopies: copies,
    };
    this.bookService.ajouterLivre(livrePourApi).subscribe({
      next: () => {
        alert('Livre ajouté avec succès !');
        this.afficherFormulaire = false;
        this.nouveauLivre = livreVide();
        this.chargerLivres();
      },
      error: () => alert('Erreur lors de l\'ajout du livre.')
    });
  }

  annulerFormulaire(): void {
    this.afficherFormulaire = false;
    this.nouveauLivre = livreVide();
  }
  gererCatalogue()  { this.router.navigate(['/catalogue']); }
  gererUtilisateurs() {
    alert('Une demande a été envoyée à l\'admin.');
  }
}
