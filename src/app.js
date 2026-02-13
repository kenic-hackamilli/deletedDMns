import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import domainsRoutes from '../modules/domains/domains.routes.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'domain-discovery-api' });
});

// API routes
app.use('/api/domains', domainsRoutes);

// Error handler
app.use(errorHandler);

export default app;
