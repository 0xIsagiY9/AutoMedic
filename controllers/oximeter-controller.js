import OximeterData from '../models/oximeter-model.js';
import User from '../models/user-model.js';
import mongoose from 'mongoose';
import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';

export const getOximeterData = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError('There is no User', 401));
  if (user.role == 'user') {
    if (req.params.patientId) {
      return next(new AppError('Access Denied', 403));
    } else {
      const oxiData = await OximeterData.find({ patientId: user._id });
      if (!oxiData) return next(new AppError('There is No Data', 404));
      return res.status(200).json({
        status: 'success',
        data: oxiData,
      });
    }
  }
  if (user.role == 'patient') {
    const oxiData = await OximeterData.find({ patientId: user._id });
    if (!oxiData) return next(new AppError('There is No Data', 404));
    return res.status(200).json({
      status: 'success',
      data: oxiData,
    });
  }

  if (user.role == 'doctor') {
    let DataOxi;
    if (req.params.patientId) {
      const patient = await User.findOne({
        _id: req.params.patientId,
        doctorId: user._id,
      });
      if (!patient) return next(new AppError('Access Denied', 401));
      DataOxi = await OximeterData.find({ patientId: req.params.patientId });
    } else {
      const patientsIds = await User.find({ doctorId: user._id }).select('_id');
      const idArray = patientsIds.map((el) => el._id);
      DataOxi = await OximeterData.find({
        patientId: { $in: idArray },
      });
    }
    return res.status(200).json({
      status: 'success',
      data: DataOxi,
    });
  }
  return next(new AppError('Access Denied', 403));
});

export const addOximeterData = catchAsync(async (req, res, next) => {
  const { patientId, bloodPressure, oxygenPercentage } = req.body;
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
  res.status(200).json({
    status: 'success',
    data: newOximeterData,
  });
});
