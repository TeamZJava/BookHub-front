export interface CommentDTO {
  id: number;
  firstName: string;
  lastName: string;
  comment: string;
  commentDate: string;
  userRating: number | null;
  reported: boolean;
}
