import {Workspace} from "../models/location";
import {WorkspaceDocument} from "../types";
import logger from "../utils/logger";

const list = async () => {
  const workspaces: WorkspaceDocument[] = await Workspace.find();
  return workspaces;
};

const add = async () => {

};

const rename = async () => {

};

const remove = async () => {

};

export default {list, add, rename, remove};
