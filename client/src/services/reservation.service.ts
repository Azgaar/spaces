import {GridRowId} from "@material-ui/data-grid";
import axios, {AxiosPromise} from "axios";
import {LocationOption, ReservationReq} from "../types";

const list = (loc: LocationOption): AxiosPromise => axios.post("/getReservations", {location: loc.id});
const add = (reservation: ReservationReq): AxiosPromise => axios.post("/addReservation", reservation);
const update = (reservation: ReservationReq): AxiosPromise => axios.post("/updateReservation", reservation);
const remove = (loc: LocationOption, selection: GridRowId[]): AxiosPromise => axios.delete("/deleteReservations", {data: {location: loc.id, selection}});
const requestList = (email: string): AxiosPromise => axios.post("/getUserReservations", {email});
const requestRemoval = (email: string, selection: GridRowId[]): AxiosPromise => axios.delete("/deleteUserReservations", {data: {email, selection}});

export const ReservationService = {list, add, update, remove, requestList, requestRemoval};
