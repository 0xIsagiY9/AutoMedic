import User from '../models/user-model.js';
import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import createToken from '../utils/create-token.js';

const signup = catchAsync(async (req, res, next) => {
  //1) Create the New User
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    role: req.body.role,
    createdAt: req.body.createdAt,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || 'patient',
  };

  if (userData.role === 'doctor' && req.body.doctorInfo) {
    userData.doctorInfo = {
      specialty: req.body.doctorInfo.specialty,
      hospital: req.body.doctorInfo.hospital,
    };
  } else if (userData.role === 'patient' && req.body.patientInfo) {
    userData.patientInfo = {
      medicalHistory: req.body.patientInfo.medicalHistory,
      emergencyContact: req.body.patientInfo.emergencyContact,
    };
    if (req.body.patientInfo.primaryDoctor)
      userData.patientInfo.primaryDoctor = req.body.patientInfo.primaryDoctor;
  }

  const newUser = await User.create(userData);

  //2) Create the Token for the New User
  const token = createToken(newUser._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  cookiesOptions.secure = true;
  res.cookie('jwt', token, cookiesOptions);
  res.status(201).json({
    status: 'success',
    token,
    user: newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please Provide Email and Password!', 400));
  //2) Check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('Incorrect email or password', 401));
  const correctPass = await user.correctPassword(password, user.password);
  if (!correctPass)
    return next(new AppError('Incorrect email or password', 401));
  //3) If everythingis Ok, send token to the client
  const token = createToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  cookiesOptions.secure = true;
  res.cookie('jwt', token, cookiesOptions);
  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});

export { signup, login };
