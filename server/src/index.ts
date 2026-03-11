import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from './routes/authRoutes';
import vendorRoutes from './routes/vendorRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import loomRoutes from './routes/loomRoutes';
import productionRoutes from './routes/productionRoutes';
import orderRoutes from './routes/orderRoutes';
import transactionRoutes from './routes/transactionRoutes';
import reportRoutes from './routes/reportRoutes';
import auditRoutes from './routes/auditRoutes';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/looms', loomRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Kumaravel LoomFlow API is running' });
});

// Database Connection & Server Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
