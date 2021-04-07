import axios, {AxiosPromise} from "axios";
import {GridRowId} from "@material-ui/data-grid";
import {LocationOption} from "../types";

const list = (loc: LocationOption): AxiosPromise => axios.post("/getWorkspaces", {loc}, {withCredentials: true});
const remove = (selection: GridRowId[]): AxiosPromise => axios.delete("/deleteWorkspaces", {data: {selection}, withCredentials: true});

export const WorkspaceService = {list, remove};
