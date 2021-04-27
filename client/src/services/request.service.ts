import axios, {AxiosPromise} from "axios";

const add = (reservationId: string, requester: string, servicesList: string[]): AxiosPromise => axios.post("/requestServices", {reservationId, requester, servicesList});

export const RequestService = {add};
