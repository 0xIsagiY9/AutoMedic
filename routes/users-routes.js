import express from 'express';
import { signup, login } from '../controllers/auth-controller.js';
import { protect, isRestricted } from '../middlewares/auth-middleware.js';
import {
  getAllUsers,
  getOneUser,
  deleteUser,
  getPatients,
  getOnePatient,
  addPatient,
} from '../controllers/user-controller.js';

const usersRoutes = express.Router();

/**
 * *************************************************************************************************************************************
 *                                                             Authenticaiotn Routes
 * *************************************************************************************************************************************
 */
usersRoutes.route('/auth/signup').post(signup);
usersRoutes.route('/auth/login').post(login);

usersRoutes.use(protect);

usersRoutes.route('/doctor').get(getPatients);
usersRoutes.route('/doctor/:pid').get(getOnePatient).post(addPatient);
usersRoutes.route('/').get(isRestricted(['admin']), getAllUsers);
usersRoutes
  .route('/:id')
  .get(isRestricted(['admin']), getOneUser)
  .delete(isRestricted(['admin']), deleteUser);

export default usersRoutes;
