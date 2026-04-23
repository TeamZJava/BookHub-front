import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LoanService } from '../services/loan.service';
import { FavoriteService } from '../services/favorite.service';
import { ReservationService } from '../services/reservation.service';
import { LoanDTO } from '../models/loan-dto.model';
import { ReservationDTO } from '../models/reservation-dto.model';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  empruntsActifs: LoanDTO[] = [];
  historique: LoanDTO[] = [];
  favoris: Book[] = [];
  reservations: ReservationDTO[] = [];
  alerteRetard = false;
  alerteFermee = false;

  constructor(
    private loanService: LoanService,
    private favoriteService: FavoriteService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.chargerEmprunts();
    this.chargerFavoris();
    this.chargerReservations();
  }

  chargerEmprunts(): void {
    this.loanService.getMyLoans().subscribe({
      next: (loans) => {
        this.empruntsActifs = loans.filter(l => l.status === 'ACTIVE' || l.status === 'OVERDUE');
        this.historique = loans.filter(l => l.status === 'RETURNED');
        this.alerteRetard = this.empruntsActifs.some(l => l.status === 'OVERDUE');
      }
    });
  }

  chargerFavoris(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (livres) => this.favoris = livres
    });
  }

  chargerReservations(): void {
    this.reservationService.getMyReservations().subscribe({
      next: (resa) => this.reservations = resa
    });
  }

  // formate une date ISO en DD/MM/YYYY pour l'affichage
  formaterDate(date: string | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  // compte les emprunts en retard pour le message d'alerte
  get nbRetards(): number {
    return this.empruntsActifs.filter(l => l.status === 'OVERDUE').length;
  }
}
