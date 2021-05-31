import axios, {AxiosPromise} from 'axios';
import {LocationOption, Workspace, WorkspaceSearchCriteria} from '../types';

const list = (location: LocationOption): AxiosPromise => axios.post('/getWorkspaces', {location: location.id});
const add = (workspace: Workspace): AxiosPromise => axios.post('/addWorkspace', workspace);
const update = (workspace: Workspace): AxiosPromise => axios.post('/updateWorkspace', workspace);
const remove = (location: LocationOption, workspaceIds: string[]): AxiosPromise => axios.delete('/deleteWorkspaces', {data: {location: location.id, selection: workspaceIds}});
const find = (criteria: WorkspaceSearchCriteria): AxiosPromise => axios.post('/findWorkspaces', criteria);

export const WorkspaceService = {list, add, update, remove, find};
