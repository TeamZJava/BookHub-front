import { Book } from './book.model';

export interface BookPage {
  content: Book[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
