import express from 'express';
import { signup, login } from '../controllers/auth-controller.js';

const usersRoutes = express.Router();

usersRoutes.route('/auth/signup').post(signup);
usersRoutes.route('/auth/login').post(login);

export default usersRoutes;
