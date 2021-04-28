import axios, {AxiosPromise} from "axios";
import {GridRowId} from "@material-ui/data-grid";
import {LocationOption, ServiceRequestStatus, ServiceReq} from "../types";

const add = (data: ServiceReq): AxiosPromise => axios.post("/requestServices", data);
const requestRemoval = (id: string, requester: string): AxiosPromise => axios.delete("/removeUserService", {data: {id, requester}});
const list = (location: LocationOption, status: ServiceRequestStatus): AxiosPromise => axios.post("/getServices", {location: location.id, status});
const process = (serviceIds: string[], status: ServiceRequestStatus): AxiosPromise => axios.post("/processServices", {serviceIds, status});
const remove = (serviceIds: GridRowId[]): AxiosPromise => axios.delete("/deleteServices", {data: {serviceIds}});

export const RequestService = {add, requestRemoval, list, process, remove};
