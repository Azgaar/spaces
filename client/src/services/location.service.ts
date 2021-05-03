import axios, {AxiosPromise} from "axios";

const list = (): AxiosPromise => axios.post("/getLocations");
const add = (description: string): AxiosPromise => axios.post("/addLocation", {description});
const rename = (id: string, description: string): AxiosPromise => axios.post("/renameLocation", {id, description});
const remove = (id: string): AxiosPromise => axios.delete("/deleteLocation", {data: {id}});

export const LocationService = {list, add, rename, remove};
