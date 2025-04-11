import OximeterData from '../models/oximeter-model.js';
import User from '../models/user-model.js';
import mongoose from 'mongoose';
import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import sendResponse from '../utils/send-response.js';

export const getOximeter = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError('There is no User', 401));
  if (user.role == 'patient') {
    const oxiData = await OximeterData.find({ patientId: user._id });
    if (!oxiData) return next(new AppError('There is No Data', 404));
    return sendResponse(res, 200, oxiData);
  }

  if (user.role == 'doctor') {
    let oxiData;
    if (req.params.id) {
      oxiData = await OximeterData.find({ patientId: req.params.id });
    } else {
      const patientsIds = await User.find({
        'patientInfo.primaryDoctor': user._id,
      }).select('_id');
      const idArray = patientsIds.map((el) => el._id);
      oxiData = await OximeterData.find({
        patientId: { $in: idArray },
      });
    }
    return sendResponse(res, 200, oxiData);
  }
  return next(new AppError('Access Denied', 403));
});

export const addOximeter = catchAsync(async (req, res, next) => {
  const patientId = req.params.id || req.body.patientId;
  
  const { bloodPressure, oxygenPercentage } = req.body;
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return next(new AppError('Invalid Patient ID', 403));
  }
  if (
    !bloodPressure ||
    typeof bloodPressure !== 'object' ||
    !bloodPressure.systolic ||
    !bloodPressure.diastolic
  ) {
    return next(new AppError('Invalid Blood pressure data'));
  }
  if (
    typeof oxygenPercentage !== 'number' ||
    oxygenPercentage < 0 ||
    oxygenPercentage > 100
  ) {
    return next(
      new AppError('Oxygen percentage must be between 0 and 100', 400)
    );
  }

  const newOximeterData = new OximeterData({
    patientId,
    bloodPressure,
    oxygenPercentage,
  });

  await newOximeterData.save();
  sendResponse(res, 200, newOximeterData);
});

