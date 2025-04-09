import catchAsync from '../utils/catch-async.js';
import User from '../models/user-model.js';
import AppError from '../utils/app-error.js';
import sendResponse from '../utils/send-response.js';
import { getOne, getAll, deleteOne } from '../utils/controllers-handler.js';

export const getAllUsers = getAll(User);
export const getOneUser = getOne(User);
export const deleteUser = deleteOne(User);
