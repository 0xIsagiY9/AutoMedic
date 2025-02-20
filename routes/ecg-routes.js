import express from 'express';
import EcgData from '../models/ecg-model.js';
import { protect } from '../middlewares/authMiddleware.js';
import { getECGData, addEcgData } from '../controllers/ecg-controller.js';

const ecgRoute = express.Router();

ecgRoute.route('/').get(protect, getECGData);
ecgRoute.route('/:patientId').get(protect, getECGData);
ecgRoute.route('/add-ecg').post(addEcgData);

export default ecgRoute;
