import {Location} from "../models/location";
import { Workspace } from "../models/workspace";
import {LocationData, LocationDocument} from "../types";
import logger from "../utils/logger";

const list = async ({onlyWithWorkspaces}: {onlyWithWorkspaces: boolean}) => {
  if (onlyWithWorkspaces) {
    const locationsWithWorkspacesIds: string[] = await Workspace.distinct("location");
    const locations: LocationDocument[] = await Location.find({_id: {$in: locationsWithWorkspacesIds}});
    return locations;
  }

  const locations: LocationDocument[] = await Location.find();
  return locations;
};

const add = async (locationData: LocationData) => {
  const location: LocationDocument = await Location.create(locationData);
  logger.info(`[Location] Location ${location.id} is created`);
  return location;
};

const rename = async (locationData: LocationData) => {
  const renamedLocation = await Location.updateOne({_id: locationData.id}, {description: locationData.description});
  logger.info(`[Location] Location renaming request: ${locationData.id}`);
  return renamedLocation;
};

const remove = async (locationData: Partial<LocationData>) => {
  const deletedlocation = await Location.deleteOne({_id: locationData.id});
  logger.info(`[Location] Location deletion request: ${locationData.id}`);
  return deletedlocation;
};

export default {list, add, rename, remove};
