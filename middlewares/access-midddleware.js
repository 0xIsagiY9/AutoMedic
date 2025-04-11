import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import User from '../models/user-model.js';

export const accessLevel = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (user.role === 'patient') {
    if (user._id !== req.params.id)
      return next(new AppError('Access Denied: You are Not Allowed', 403));
    return next();
  }

  if (user.role === 'doctor') {
    const patient = await User.findOne({
      _id: req.params.id,
      'patientInfo.primaryDoctor': user._id,
    });
    console.log(patient);
    if (!patient)
      return next(new AppError('Access Denied: There is No Patient', 403));
    return next();
  }
});
