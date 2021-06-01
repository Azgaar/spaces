import {Schema, model} from 'mongoose';
import {LocationDocument} from '../types';

const locationSchema = new Schema(
  {
    description: {type: String, required: true},
    layout: {type: Object}
  },
  {timestamps: true, versionKey: false}
);

locationSchema.set('toJSON', {
  transform: (doc: LocationDocument, ret: LocationDocument) => {
    const {_id, layout, description} = ret;
    return {id: _id, layout, description};
  }
});

export const Location = model<LocationDocument>('Location', locationSchema);
