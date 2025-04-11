import catchAsync from '../utils/catch-async.js';
import User from '../models/user-model.js';
import AppError from '../utils/app-error.js';
import sendResponse from '../utils/send-response.js';
import { getOne, getAll, deleteOne } from '../utils/controllers-handler.js';

export const getAllUsers = getAll(User);
export const getOneUser = getOne(User);
export const deleteUser = deleteOne(User);

export const getPatients = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (user.role !== 'doctor')
    return next(new AppError('You are not a Doctor', 403));
  const patients = user.doctorInfo.patients;
  sendResponse(res, 200, patients);
});

export const getOnePatient = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (user.role == 'patient')
    return next(new AppError('You Do not Have a permissions'), 403);
  const patientIds = user.doctorInfo.patients;
  console.log(patientIds);
  const findPatient = patientIds.find((elememt) => elememt == req.params.pid);
  if (!findPatient)
    return next(new AppError('There is No Patient with This ID', 404));
  console.log(findPatient);
  sendResponse(res, 200, findPatient);
});

export const addPatient = catchAsync(async (req, res, next) => {
  const user = req.user;
  const patient = await User.findById(req.params.pid);
  // 1) Check Patient in Database or not.
  if (!patient)
    return next(new AppError('There is No Patient with this ID', 404));
  // 2) Add Patient to the Doctor Patient Id's Arrays
  let patientIds = user.doctorInfo.patients;
  patientIds.push(req.params.pid);
  console.log(patientIds);
  const newDoct = await User.findByIdAndUpdate(user._id, {
    'doctorInfo.patients': patientIds,
  });
  // 3) Add Doctor Id to the PatientInfo primary Doctor
  const newPatint = await User.findByIdAndUpdate(patient._id, {
    'patientInfo.primaryDoctor': user._id,
  });
  sendResponse(res, 200, newDoct);
});
