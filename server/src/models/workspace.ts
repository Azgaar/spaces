import {Schema, model} from 'mongoose';
import {WorkspaceDocument, WorkspaceStatus, WorkspaceType, Equipment, WorkspaceData} from '../types';

const required = true;
const workspaceSchema = new Schema(
  {
    description: {type: String, required},
    location: {type: Schema.Types.ObjectId, required},
    status: {type: String, enum: WorkspaceStatus, required},
    type: {type: String, enum: WorkspaceType, required},
    size: {type: Number, required},
    equipment: [{type: String, enum: Equipment}]
  },
  {timestamps: true, versionKey: false}
);

workspaceSchema.set('toJSON', {
  transform: (doc: WorkspaceDocument, ret: WorkspaceDocument) => {
    const {_id, description, location, status, type, size, equipment} = ret;
    const workspaceData: WorkspaceData = {id: _id, description, location, status, type, size, equipment};
    return workspaceData;
  }
});

export const Workspace = model<WorkspaceDocument>('Workspace', workspaceSchema);
