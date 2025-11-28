import { Request, Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { TransactionCreate } from '../models/Transaction';

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, description, category_id, type, date }: TransactionCreate = req.body;
    const userId = req.user!.userId;

    if (!amount || !category_id || !type || !date) {
      return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, description, category_id, type, date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, amount, description, category_id, type, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.user_id = $1 
       ORDER BY t.date DESC, t.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.color as category_color 
       FROM transactions t 
       LEFT JOIN categories c ON t.category_id = c.id 
       WHERE t.id = $1 AND t.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Транзакция не найдена' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting transaction:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, description, category_id, type, date } = req.body;
    const userId = req.user!.userId;

    const result = await pool.query(
      `UPDATE transactions 
       SET amount = $1, description = $2, category_id = $3, type = $4, date = $5 
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      [amount, description, category_id, type, date, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Транзакция не найдена' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Транзакция не найдена' });
    }

    res.json({ message: 'Транзакция удалена' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};