import axios, {AxiosPromise} from "axios";
import {GridRowId} from "@material-ui/data-grid";
import {LocationOption, Workspace} from "../types";

const list = (loc: LocationOption): AxiosPromise => axios.post("/getWorkspaces", {location: loc.id});
const add = (workspace: Workspace): AxiosPromise => axios.post("/addWorkspace", workspace);
const remove = (selection: GridRowId[]): AxiosPromise => axios.delete("/deleteWorkspaces", {data: {selection}});

export const WorkspaceService = {list, add, remove};
