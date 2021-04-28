import axios, {AxiosPromise} from "axios";
import {ServiceRequestStatus} from "../types";

const add = (reservationId: string, requester: string, servicesList: string[]): AxiosPromise => axios.post("/requestServices", {reservationId, requester, servicesList});
const requestRemoval = (id: string, requester: string): AxiosPromise => axios.delete("/removeUserService", {data: {id, requester}});
const list = (status: ServiceRequestStatus): AxiosPromise => axios.post("/getServices", {status});
const process = (serviceIds: string[], status: ServiceRequestStatus): AxiosPromise => axios.post("/processServices", {serviceIds, status});
const remove = (serviceIds: string[]): AxiosPromise => axios.delete("/deleteServices", {data: {serviceIds}});

export const RequestService = {add, requestRemoval, list, process, remove};
