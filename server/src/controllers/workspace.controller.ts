import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';
import workspaceService from '../services/workspace';

const list = catchAsync(async (req, res, next) => {
  const {location} = req.body;
  const workspaces = await workspaceService.list(location);
  if (!workspaces) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch workspaces'));
  }

  res.status(httpStatus.OK).send(workspaces);
});

const add = catchAsync(async (req, res, next) => {
  const addedWorkspace = await workspaceService.add(req.body);
  if (!addedWorkspace) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot add workspace'));
  }

  res.status(httpStatus.CREATED).send(addedWorkspace);
});

const update = catchAsync(async (req, res, next) => {
  const updatedWorkspace = await workspaceService.update(req.body);
  if (!updatedWorkspace) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot update workspace'));
  }

  const workspaces = await workspaceService.list(updatedWorkspace.location);
  if (!workspaces) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch workspaces'));
  }

  res.status(httpStatus.OK).send(workspaces);
});

const remove = catchAsync(async (req, res, next) => {
  const {location, selection} = req.body;
  const removed = await workspaceService.remove(selection);
  if (!removed) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot remove workspaces'));
  }

  const workspaces = await workspaceService.list(location);
  if (!workspaces) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch workspaces'));
  }

  res.status(httpStatus.OK).send(workspaces);
});

const find = catchAsync(async (req, res, next) => {
  const workspaces = await workspaceService.find(req.body);
  if (!workspaces) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'No free workspaces found'));
  }

  res.status(httpStatus.OK).send(workspaces);
});

export const workspaceController = {list, add, update, remove, find};
