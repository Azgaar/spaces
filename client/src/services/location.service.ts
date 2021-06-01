import axios, {AxiosPromise} from 'axios';
import {LocationOption} from '../types';

const list = (options: {onlyWithWorkspaces: boolean}): AxiosPromise => axios.post('/getLocations', options);
const add = (description: string): AxiosPromise => axios.post('/addLocation', {description});
const update = (location: LocationOption): AxiosPromise => axios.patch('/locations/' + location.id, location);
const remove = (id: string): AxiosPromise => axios.delete('/deleteLocation', {data: {id}});

export const LocationService = {list, add, update, remove};
