import { UserResponse } from './user-response.model';
import { Book } from './book.model';

export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'RETURNED';

export interface LoanDTO {
  id: number;
  user: UserResponse;
  book: Book;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
}
