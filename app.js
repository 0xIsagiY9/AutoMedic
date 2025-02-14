import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import usersRoutes from './routes/users-routes.js';
import errorHandler from './controllers/error-controller.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/user', usersRoutes);

app.use(errorHandler);
export default app;
