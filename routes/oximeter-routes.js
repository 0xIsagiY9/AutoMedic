import express from 'express';
import { protect } from '../middlewares/auth-middleware.js';
import {
  getOximeter,
  addOximeter,
} from '../controllers/oximeter-controller.js';

const oximeterRoute = express.Router();

oximeterRoute.use(protect);

oximeterRoute.route('/').get(getOximeter).post(addOximeter);
oximeterRoute.route('/:id').post(addOximeter).get(getOximeter);

export default oximeterRoute;
