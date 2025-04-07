import express from 'express';
import { signup, login } from '../controllers/auth-controller.js';

const usersRoutes = express.Router();

/**
 * *************************************************************************************************************************************
 *                                                             Authenticaiotn Routes
 * *************************************************************************************************************************************
 */
usersRoutes.route('/auth/signup').post(signup);
usersRoutes.route('/auth/login').post(login);
usersRoutes.route('/auth/logout').post();
usersRoutes.route('/auth/me').get().post();


usersRoutes.route('/').get(); // Get All Users
usersRoutes.route('/:id').get().patch().delete(); // Get Specific User

usersRoutes.route('/doctor/patients').get(); // Get All Patient for this Doctor
usersRoutes.route('/doctor/patients/:id').get(); // Get Specific Patient for this Doctor

export default usersRoutes;
