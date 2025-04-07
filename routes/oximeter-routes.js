import express from 'express';
import OximeterData from '../models/oximeter-model.js';
import { protect } from '../middlewares/auth-middleware.js';
import {
  getOximeterData,
  addOximeterData,
} from '../controllers/oximeter-controller.js';

const oximeterRoute = express.Router();

oximeterRoute.route('/').get(protect, getOximeterData);
oximeterRoute.route('/:patientId').get(protect, getOximeterData);
oximeterRoute.route('/add-oximeter').post(addOximeterData);

export default oximeterRoute;
