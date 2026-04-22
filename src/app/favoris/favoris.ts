import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FavoriteService } from '../services/favorite.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './favoris.html',
  styleUrl: './favoris.css',
})
export class Favoris implements OnInit {

  favoris: Book[] = [];

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.chargerFavoris();
  }

  chargerFavoris(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (livres) => this.favoris = livres
    });
  }

  supprimerFavori(bookId: number): void {
    this.favoriteService.removeFavorite(bookId).subscribe({
      next: () => this.chargerFavoris()
    });
  }
}
