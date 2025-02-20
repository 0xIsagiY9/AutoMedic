import User from '../models/user-model.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { promisify } from 'util';

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  //1) Create the New User
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    patients: req.body.patients,
    doctorId: req.body.doctorId,
  });

  //2) Create the Token for the New User
  const token = getToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
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
  const token = getToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

export { signup, login };
