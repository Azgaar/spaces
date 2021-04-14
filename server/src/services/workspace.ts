import {Workspace} from "../models/workspace";
import {Reservation} from "../models/reservation";
import {WorkspaceData, WorkspaceDocument, WorkspaceStatus, ReservationDocument} from "../types";
import logger from "../utils/logger";

const list = async (location: string) => {
  const workspaces: WorkspaceDocument[] = await Workspace.find({location});
  return workspaces;
};

const add = async (workspaceData: WorkspaceData) => {
  const workspace: WorkspaceDocument = await Workspace.create(workspaceData);
  logger.info(`[Workspace] Workspace ${workspace.id} is created`);
  return workspace;
};

const update = async (workspaceData: WorkspaceData) => {
  const workspace = await Workspace.findById(workspaceData.id);
  if (!workspace) return false;

  Object.assign(workspace, workspaceData);
  const updatedWorkspace: WorkspaceDocument = await workspace.save();
  logger.info(`[Workspace] Workspace ${updatedWorkspace.id} is updated`);
  return updatedWorkspace;
};

const remove = async (ids: Array<string>) => {
  const deletedWorkspaces = await Workspace.deleteMany({_id: {$in: ids}});
  logger.info(`[Workspace] Workspace deletion request: ${ids.join(", ")}`);
  return deletedWorkspaces;
};

const find = async (location: string, from: Date, to: Date, current?: string) => {
  const overlappingQuery: {location: string, from: {}, to: {}, _id?: {}} = {location, from: {$lt: to}, to: {$gt: from}};
  if (current) overlappingQuery._id = {$ne: current};

  const reservations = await Reservation.find(overlappingQuery);
  console.log(`reservations overlapping within ${from} - ${to}`, reservations);

  const reservedWorkspaces: string[] = await Reservation.distinct("workspace", overlappingQuery);
  console.log({reservedWorkspaces});

  const availableQuery: {location: string, status: WorkspaceStatus, _id: {}} = {location, status: WorkspaceStatus.AVAILABLE, _id: {$nin: reservedWorkspaces}};
  const workspaces: WorkspaceDocument[] = await Workspace.find(availableQuery);
  console.log({workspaces});
  return workspaces;
};

export default {list, add, update, remove, find};
