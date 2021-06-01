import Joi from '@hapi/joi';

const id = Joi.string().min(2).max(128).required();
const description = Joi.string().min(2).max(256).trim().required();
const layout = Joi.object({
  space: Joi.array(),
  walls: Joi.array(),
  obstacles: Joi.array(),
  entrances: Joi.array(),
  fireExits: Joi.array()
});

export type LocationLayout = {
  space: number[][];
  walls: number[][][];
  obstacles: number[][][];
  entrances: number[][][];
  fireExits: number[][][];
};

const locationCreationSchema = Joi.object({description});
const locationDeletionSchema = Joi.object({id});
const locationUpdateSchema = Joi.object({id, description: description.optional(), layout});

export {locationCreationSchema, locationDeletionSchema, locationUpdateSchema};
