import { Book } from './book.model';
import { CommentDTO } from './comment.model';

export interface BookDetailDTO {
  book: Book;
  comments: CommentDTO[];
  isFavorite: boolean;
  userRating: number | null;
}
