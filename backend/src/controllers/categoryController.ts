import { Request, Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY type, name'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getCategoriesByType = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;

    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ message: 'Тип должен быть income или expense' });
    }

    const result = await pool.query(
      'SELECT * FROM categories WHERE type = $1 ORDER BY name',
      [type]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting categories by type:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};