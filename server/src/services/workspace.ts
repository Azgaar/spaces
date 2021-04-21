import {Workspace} from "../models/workspace";
import {Reservation} from "../models/reservation";
import {WorkspaceData, WorkspaceDocument, WorkspaceStatus, WorkspaceSearchCriteria, WorkspaceType, Equipment} from "../types";
import logger from "../utils/logger";
import config from "../config";

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

const find = async (criteria: WorkspaceSearchCriteria) => {
  const {location, from, to, size, type, equipment, excludeReservation} = criteria;

  const overlappingQuery: reservationsSQ = {location, from: {$lt: to}, to: {$gt: from}};
  if (excludeReservation) overlappingQuery._id = {$ne: excludeReservation};
  const reservedWorkspaces: string[] = await Reservation.distinct("workspace", overlappingQuery);

  const availableQuery: workspacesSQ = {location, status: WorkspaceStatus.AVAILABLE};
  if (size) availableQuery.size = {$gte: size};
  if (type) availableQuery.type = type;
  if (equipment && equipment.length) availableQuery.equipment = {$all: equipment};
  if (reservedWorkspaces.length) availableQuery._id = {$nin: reservedWorkspaces};
  const workspaces: WorkspaceDocument[] = await Workspace.find(availableQuery).limit(config.workspaces.maxNumberToReturn);

  console.log({overlappingQuery}, {reservedWorkspaces}, {availableQuery}, {workspaces});
  return workspaces;
};

type reservationsSQ = {
  location: string;
  from: {};
  to: {};
  _id?: {};
}

type workspacesSQ = {
  location: string;
  status: WorkspaceStatus;
  size?: {};
  type?: WorkspaceType;
  equipment?: {};
  _id?: {};
}

export default {list, add, update, remove, find};
