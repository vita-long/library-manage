export interface Book {
  id: string;
  bookName: string;
  bookCode?: string;
  cover: string;
  author: string;
  description?: string;
  isFavorite?: boolean;
  isBorrow?: 0 | 1;
}
