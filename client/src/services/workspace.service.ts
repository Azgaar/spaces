import axios, {AxiosPromise} from "axios";
import {GridRowId} from "@material-ui/data-grid";
import {LocationOption} from "../types";

const list = (loc: LocationOption): AxiosPromise => axios.post("/getWorkspaces", {location: loc.id});
const remove = (selection: GridRowId[]): AxiosPromise => axios.delete("/deleteWorkspaces", {data: {selection}});

export const WorkspaceService = {list, remove};
