import axios, {AxiosPromise} from "axios";
import {GridRowId} from "@material-ui/data-grid";
import {LocationOption, Workspace} from "../types";

const list = (loc: LocationOption): AxiosPromise => axios.post("/getWorkspaces", {location: loc.id});
const add = (workspace: Workspace): AxiosPromise => axios.post("/addWorkspace", workspace);
const update = (workspace: Workspace): AxiosPromise => axios.post("/updateWorkspaces", workspace);
const remove = (loc: LocationOption, selection: GridRowId[]): AxiosPromise => axios.delete("/deleteWorkspaces", {data: {location: loc.id, selection}});

export const WorkspaceService = {list, add, update, remove};
