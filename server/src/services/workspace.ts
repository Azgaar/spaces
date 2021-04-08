import {Workspace} from "../models/workspace";
import {WorkspaceData, WorkspaceDocument} from "../types";
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

const update = async (workspace: WorkspaceDocument, workspaceData: WorkspaceData) => {
  Object.assign(workspace, workspaceData);
  const updatedWorkspace: WorkspaceDocument = await workspace.save();
  logger.info(`[Workspace] Workspace ${updatedWorkspace.id} is updated`);
  return updatedWorkspace;
};

const remove = async (workspaces: Array<string>) => {
  const deletedWorkspaces = await Workspace.deleteMany({_id: {$in: workspaces}});
  logger.info(`[Workspace] Workspace deletion request: ${workspaces.join(", ")}`);
  return deletedWorkspaces;
};

export default {list, add, update, remove};
