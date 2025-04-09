import catchAsync from './catch-async.js';
import AppError from './app-error.js';
import sendResponse from './send-response.js';
import APIQuery from './api-features.js';
import { Model } from 'mongoose';

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const query = new APIQuery(Model.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    const doc = await query.query;
    sendResponse(res, 200, doc);
  });

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let mongQuery = Model.findById(req.params.id);
    const query = new APIQuery(mongQuery, req.query).fields();
    const doc = await query.query;
    if (!doc) return next(new AppError('No Document found with thid id', 404));

    sendResponse(res, 200, doc);
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with this ID', 404));
    sendResponse(res, 204, null);
  });
