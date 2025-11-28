export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  user_id?: number;
  created_at: Date;
}