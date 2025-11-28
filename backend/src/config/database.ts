import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Функция для инициализации всех таблиц
export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // Таблица пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Таблица категорий
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(10) CHECK (type IN ('income', 'expense')),
        color VARCHAR(7) DEFAULT '#007bff',
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Таблица транзакций
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        description VARCHAR(255),
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        type VARCHAR(10) CHECK (type IN ('income', 'expense')),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Создаем стандартные категории для нового пользователя
    await createDefaultCategories();

    console.log('✅ Все таблицы инициализированы успешно');
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Создание стандартных категорий
const createDefaultCategories = async () => {
  const defaultCategories = [
    // Доходы
    { name: 'Зарплата', type: 'income', color: '#28a745' },
    { name: 'Фриланс', type: 'income', color: '#20c997' },
    { name: 'Инвестиции', type: 'income', color: '#17a2b8' },
    { name: 'Подарки', type: 'income', color: '#6f42c1' },
    
    // Расходы
    { name: 'Продукты', type: 'expense', color: '#dc3545' },
    { name: 'Транспорт', type: 'expense', color: '#fd7e14' },
    { name: 'Развлечения', type: 'expense', color: '#e83e8c' },
    { name: 'Жилье', type: 'expense', color: '#6c757d' },
    { name: 'Здоровье', type: 'expense', color: '#6610f2' },
    { name: 'Одежда', type: 'expense', color: '#d63384' },
  ];

  for (const category of defaultCategories) {
    await pool.query(`
      INSERT INTO categories (name, type, color)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `, [category.name, category.type, category.color]);
  }
};