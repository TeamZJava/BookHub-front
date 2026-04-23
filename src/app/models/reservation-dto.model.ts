import { UserResponse } from './user-response.model';
import { Book } from './book.model';

export type ReservationStatus = 'PENDING' | 'AVAILABLE' | 'CANCELED';

export interface ReservationDTO {
  id: number;
  user: UserResponse;
  book: Book;
  reservationDate: string;
  rankInLine: number;
  status: ReservationStatus;
}
