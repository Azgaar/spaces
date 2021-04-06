import {Location} from "../models/location";
import {LocationData, LocationDocument} from "../types";
import logger from "../utils/logger";

const list = async () => {
  const locations: LocationDocument[] = await Location.find();
  return locations;
};

const add = async (inputData: LocationData) => {
  const location: LocationDocument = await Location.create(inputData);
  logger.info(`[Location] Location ${location.id} is created`);
  return location;
};

const rename = async (inputData: LocationData) => {
  const renamedLocation = await Location.updateOne({_id: inputData.id}, {description: inputData.description});
  logger.info(`[Location] Location renaming request: ${inputData.id}`);
  return renamedLocation;
};

const remove = async (inputData: Partial<LocationData>) => {
  const deletedlocation = await Location.deleteOne({_id: inputData.id});
  logger.info(`[Location] Location deletion request: ${inputData.id}`);
  return deletedlocation;
};

export default {list, add, rename, remove};
