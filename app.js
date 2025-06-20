import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import usersRoutes from './routes/users-routes.js';
import errorHandler from './controllers/error-controller.js';
import ecgRoute from './routes/ecg-routes.js';
import oximeterRoute from './routes/oximeter-routes.js';
import cors from 'cors';

const app = express();
// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true, // If you're using cookies/sessions
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
dotenv.config();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/ecg', ecgRoute);
app.use('/api/v1/oximeter', oximeterRoute);

app.use(errorHandler);
export default app;
