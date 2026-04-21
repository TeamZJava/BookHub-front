import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { FavoriteService } from '../services/favorite.service';
import { AuthService } from '../services/auth.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-catalogue',
  imports: [FormsModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue implements OnInit {
  // injections : appels HTTP (Book/Favorite), Auth (rôle), Router (navigation)
  private bookService = inject(BookService);
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Liste des livres affichés
  books: Book[] = [];

  // Infos pour la pagination
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;

  // Filtres
  categories: string[] = [];
  favoriteIds: number[] = [];

  // Champs pour les filtres
  search = '';
  selectedCategory = '';
  availabilityFilter: string = '';
  sortField = 'title';

  // Autorise l'affichage du bouton supprimer si role LIBRARIAN ou ADMIN
  get canDelete(): boolean {
    return this.authService.hasRole('LIBRARIAN') || this.authService.hasRole('ADMIN');
  }

  // Direction de tri ordre alphabétique ou inverse
  get sortDirection(): string {
    return this.sortField === 'title' ? 'ASC' : 'DESC';
  }

  // Méthode appelée chargement page
  ngOnInit() {
    this.loadBooks();
    this.loadCategories();
    this.loadFavorites();
  }

  // Appelle l'API pour récupérer les livres (catalogue) + met à jour la pagination
  loadBooks() {
    this.bookService
      .getBooks(
        this.currentPage,
        20,
        this.search,
        this.selectedCategory,
        this.availabilityFilter,
        this.sortField,
        this.sortDirection,
      )
      .subscribe({
        next: (page) => {
          if (!page) {
            this.books = [];
            this.totalPages = 0;
            this.totalElements = 0;
            return;
          }
          this.books = page.content ?? [];
          this.totalPages = page.totalPages ?? 0;
          this.totalElements = page.totalElements ?? 0;
        },
        error: () => {
          this.books = [];
          this.totalPages = 0;
          this.totalElements = 0;
        },
      });
  }

  // Récupère les catégories (pour le filtre)
  loadCategories() {
    this.bookService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  // Récupère les favoris de l'utilisateur connecté (pour colorer les coeurs)
  loadFavorites() {
    this.favoriteService.getFavorites().subscribe({
      next: (favs) => {
        this.favoriteIds = favs.map((b) => b.id);
      },
      error: () => {
        this.favoriteIds = [];
      },
    });
  }

  // Vérifie si un livre est en favori
  isFavorite(bookId: number): boolean {
    return this.favoriteIds.includes(bookId);
  }

  // Lance une recherche (enter dans le champ)
  onSearch() {
    this.currentPage = 0;
    this.loadBooks();
  }

  // Quand un filtre change (tri, catégorie, dispo)
  onFilterChange() {
    this.currentPage = 0;
    this.loadBooks();
  }

  // Navigation vers une page de pagination
  goToPage(page: number) {
    this.currentPage = page;
    this.loadBooks();
  }

  // Ouvre la page détail du livre
  viewDetail(bookId: number) {
    this.router.navigate(['/books', bookId]);
  }

  // Ajoute/supprime un favori (clic sur le coeur)
  toggleFavorite(bookId: number, event: Event) {
    event.stopPropagation();
    if (this.isFavorite(bookId)) {
      this.favoriteService.removeFavorite(bookId).subscribe(() => {
        this.favoriteIds = this.favoriteIds.filter((id) => id !== bookId);
      });
    } else {
      this.favoriteService.addFavorite(bookId).subscribe(() => {
        this.favoriteIds.push(bookId);
      });
    }
  }

  // Supprime un livre — bouton visible uniquement pour LIBRARIAN ou ADMIN (canDelete dans html selon role)
  deleteBook(bookId: number, event: Event) {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.bookService.deleteBook(bookId).subscribe(() => this.loadBooks());
    }
  }

  // Construit la liste [0..totalPages-1] pour afficher les boutons selon nbre de pages
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
