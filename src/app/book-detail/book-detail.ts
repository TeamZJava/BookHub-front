import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BookService } from '../services/book.service';
import { FavoriteService } from '../services/favorite.service';
import { LoanService } from '../services/loan.service';
import { ReservationService } from '../services/reservation.service';
import { BookDetailDTO } from '../models/book-detail.model';

@Component({
  selector: 'app-book-detail',
  imports: [FormsModule, DatePipe],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  private favoriteService = inject(FavoriteService);
  private loanService = inject(LoanService);
  private reservationService = inject(ReservationService);

  // Données affichées à l'écran (null tant que pas charger)
  bookDetail: BookDetailDTO | null = null;

  // Champs du form
  userRating = 0;
  userComment = '';

  // Message de succès/erreur affiché à l'user
  message = '';

  // Tableau pour afficher 5 étoiles dans le HTML
  stars = [1, 2, 3, 4, 5];

  // Récupère l'id dans l'URL (/books/:id) puis charge le détail du livre
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBook(id);
  }

  // Appelle l'API pour récupérer toutes les infos du livre (détail + commentaires + favori + note)
  loadBook(id: number) {
    this.bookService.getBookDetail(id).subscribe((detail) => {
      this.bookDetail = detail;
      this.userRating = detail.userRating ?? 0;
    });
  }

  // Change la note en cliquant sur une étoile
  setRating(star: number) {
    this.userRating = star;
  }

  // Ajoute ou retire le livre des favoris en cliquant sur le coeur
  toggleFavorite() {
    if (!this.bookDetail) return;
    const bookId = this.bookDetail.book.id;
    if (this.bookDetail.isFavorite) {
      this.favoriteService.removeFavorite(bookId).subscribe(() => {
        this.bookDetail!.isFavorite = false;
      });
    } else {
      this.favoriteService.addFavorite(bookId).subscribe(() => {
        this.bookDetail!.isFavorite = true;
      });
    }
  }

  // Emprunte le livre (bouton Emprunter)
  borrow() {
    if (!this.bookDetail) return;
    this.loanService.borrow(this.bookDetail.book.id).subscribe({
      next: () => {
        this.message = 'Emprunt effectué avec succès !';
        this.loadBook(this.bookDetail!.book.id);
      },
      error: () => {
        this.message = "Erreur lors de l'emprunt.";
      },
    });
  }

  // Réserve le livre (bouton Réserver)
  reserve() {
    if (!this.bookDetail) return;
    this.reservationService.reserve(this.bookDetail.book.id).subscribe({
      next: () => {
        this.message = 'Réservation effectuée avec succès !';
      },
      error: () => {
        this.message = 'Erreur lors de la réservation.';
      },
    });
  }

  // Envoie la note et/ou le commentaire au back
  submitReview() {
    if (!this.bookDetail) return;
    const bookId = this.bookDetail.book.id;
    if (this.userRating > 0) {
      this.bookService.rateBook(bookId, this.userRating).subscribe();
    }
    if (this.userComment.trim()) {
      this.bookService.addComment(bookId, this.userComment).subscribe(() => {
        this.userComment = '';
        this.loadBook(bookId);
      });
    }
  }

  // Retour au catalogue
  goBack() {
    this.router.navigate(['/catalogue']);
  }
}
