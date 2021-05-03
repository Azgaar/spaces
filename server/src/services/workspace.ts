import {Workspace} from "../models/workspace";
import {WorkspaceData, WorkspaceDocument, WorkspaceStatus} from "../types";
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

export default {list, add, update, remove};
