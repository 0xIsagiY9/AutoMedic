import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import usersRoutes from './routes/users-routes.js';
import errorHandler from './controllers/error-controller.js';
import ecgRoute from './routes/ecg-routes.js';
import oximeterRoute from './routes/oximeter-routes.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/ecg', ecgRoute);
app.use('/api/v1/oximeter', oximeterRoute);

app.use(errorHandler);
export default app;
