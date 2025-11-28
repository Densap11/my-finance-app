import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions'; // Добавляем
import categoryRoutes from './routes/categories'; // Добавляем

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes); // Добавляем
app.use('/api/categories', categoryRoutes); // Добавляем

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();