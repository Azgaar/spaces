import {Workspace} from '../models/workspace';
import {Reservation} from '../models/reservation';
import {WorkspaceData, WorkspaceDocument, WorkspaceStatus, WorkspaceSearchCriteria, WorkspaceType, Equipment} from '../types';
import logger from '../utils/logger';
import config from '../config';
import {DeleteWriteOpResultObject} from 'mongodb';

const list = async (location: string): Promise<WorkspaceDocument[]> => {
  const workspaces: WorkspaceDocument[] = await Workspace.find({location});
  return workspaces;
};

const add = async (workspaceData: WorkspaceData): Promise<WorkspaceDocument> => {
  const workspace: WorkspaceDocument = await Workspace.create(workspaceData);
  logger.info(`[Workspace] Workspace ${workspace.id} is created`);
  return workspace;
};

const update = async (workspaceData: WorkspaceData): Promise<WorkspaceDocument | false> => {
  const workspace = await Workspace.findById(workspaceData.id);
  if (!workspace) {
    return false;
  }

  Object.assign(workspace, workspaceData);
  const updatedWorkspace: WorkspaceDocument = await workspace.save();
  logger.info(`[Workspace] Workspace ${updatedWorkspace.id} is updated`);
  return updatedWorkspace;
};

const remove = async (ids: string[]): Promise<DeleteWriteOpResultObject['result']> => {
  const deletedWorkspaces = await Workspace.deleteMany({_id: {$in: ids}});
  logger.info(`[Workspace] Workspace deletion request: ${ids.join(', ')}`);
  return deletedWorkspaces;
};

const find = async (criteria: WorkspaceSearchCriteria): Promise<WorkspaceDocument[]> => {
  const {location, from, to, size, type, equipment, description, excludeReservation} = criteria;

  const overlappingQuery: reservationsSQ = {location, from: {$lt: new Date(to)}, to: {$gt: new Date(from)}};
  if (excludeReservation) {
    overlappingQuery._id = {$ne: excludeReservation};
  }
  const reservedWorkspaces: string[] = await Reservation.distinct('workspace', overlappingQuery);

  const availableQuery: workspacesSQ = {location, status: WorkspaceStatus.AVAILABLE};
  if (size && size > 1) {
    availableQuery.size = {$gte: size};
  }
  if (type) {
    availableQuery.type = type;
  }
  if (equipment && equipment.length) {
    availableQuery.equipment = {$all: equipment};
  }
  if (description) {
    availableQuery.description = {$regex: description.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&')};
  }
  if (reservedWorkspaces.length) {
    availableQuery._id = {$nin: reservedWorkspaces};
  }
  const workspaces: WorkspaceDocument[] = await Workspace.find(availableQuery).limit(config.workspaces.maxNumberToReturn);

  return workspaces;
};

type reservationsSQ = {
  location: string;
  from: {
    $lt: Date;
  };
  to: {
    $gt: Date;
  };
  _id?: {
    $ne: string;
  };
};

type workspacesSQ = {
  location: string;
  status: WorkspaceStatus;
  size?: {
    $gte: number;
  };
  type?: WorkspaceType;
  equipment?: {
    $all: Equipment[];
  };
  description?: {
    $regex: string;
  };
  _id?: {
    $nin: string[];
  };
};

export default {list, add, update, remove, find};
