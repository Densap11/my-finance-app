export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  description: string;
  category_id: number;
  type: 'income' | 'expense';
  date: string;
  created_at: Date;
}

export interface TransactionCreate {
  amount: number;
  description: string;
  category_id: number;
  type: 'income' | 'expense';
  date: string;
}

export interface TransactionWithCategory extends Transaction {
  category_name: string;
  category_color: string;
}