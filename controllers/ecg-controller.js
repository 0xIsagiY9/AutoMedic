import EcgData from '../models/ecg-model.js';
import User from '../models/user-model.js';
import mongoose from 'mongoose';
import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';

export const getECGData = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError('There is no User', 401));
  if (user.role == 'user') {
    if (req.params.patientId) {
      return next(new AppError('Access Denied', 403));
    } else {
      const ecgData = await EcgData.find({ patientId: user._id });
      return res.status(200).json({
        status: 'success',
        data: ecgData,
      });
    }
  }
  if (user.role == 'patient') {
    const ecgData = await EcgData.find({ patientId: user._id });
    return res.status(200).json({
      status: 'success',
      data: ecgData,
    });
  }

  if (user.role == 'doctor') {
    let DataECG;
    if (req.params.patientId) {
      const patient = await User.findOne({
        _id: req.params.patientId,
        doctorId: user._id,
      });
      if (!patient) return next(new AppError('Access Denied', 401));
      DataECG = await EcgData.find({ patientId: req.params.patientId });
    } else {
      const patientsIds = await User.find({ doctorId: user._id }).select('_id');
      const idArray = patientsIds.map((el) => el._id);
      DataECG = await EcgData.find({
        patientId: { $in: idArray },
      });
    }
    return res.status(200).json({
      status: 'success',
      data: DataECG,
    });
  }
  return next(new AppError('Access Denied', 403));
});

export const addEcgData = catchAsync(async (req, res, next) => {
  const { patientId, readings } = req.body;
  if (!mongoose.Types.ObjectId.isValid(patientId))
    return next(new AppError('Invalid patient ID'), 400);
  if (!Array.isArray(readings) || readings.length === 0)
    return next(new AppError('Readingmust be a non-embty array', 400));

  const newEcgData = new EcgData({
    patientId,
    readings,
  });

  await newEcgData.save();

  res.status(200).json({
    status: 'success',
    data: readings,
  });
});
