import User from '../models/user-model.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';


export const protect = catchAsync(async (req, res, next) => {
  //1) Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are no Logged in! Please login to get access.', 401)
    );
  }

  //2) Verfication of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        'The current user belonging to this token does no longer exist.',
        401
      )
    );

  //4) Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // 5) Grant access to protected route
  req.user = currentUser;
  next();
});
