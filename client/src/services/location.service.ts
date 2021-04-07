import axios, {AxiosPromise} from "axios";

const list = (): AxiosPromise => axios.post("/getLocations", {}, {withCredentials: true});
const add = (description: string): AxiosPromise => axios.post("/addLocation", {description}, {withCredentials: true});
const rename = (id: string, description: string): AxiosPromise => axios.post("/renameLocation", {id, description}, {withCredentials: true});
const remove = (id: string): AxiosPromise => axios.delete("/deleteLocation", {data: {id}, withCredentials: true});

export const LocationService = {list, add, rename, remove};

// axios.delete("/deleteLocation", {data: {id: location.id}, withCredentials: true})
// axios.post("/renameLocation", {id: location.id, description: locationInput}, {withCredentials: true})
// axios.post("/addLocation", {description: locationInput}, {withCredentials: true})