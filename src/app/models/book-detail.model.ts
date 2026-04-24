import { Book } from './book.model';
import { CommentDTO } from './comment.model';

export interface BookDetailDTO {
  book: Book;
  comments: CommentDTO[];
  favorite: boolean;
  userRating: number | null;
}
