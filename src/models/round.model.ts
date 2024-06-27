import mongoose, { Model, Schema, Types } from 'mongoose';
import { ISet, setSchema } from './set.model';

export interface IRound {
  _id: Types.ObjectId;
  setList: ISet[][];
  roundSetType: RoundSetType;
}

export enum RoundSetType {
  singleSet = 'Single Set',
  superSet = 'Super Set',
  triSet = 'Tri Set',
  giantSet = 'Giant Set',
  hiitSet = 'HIIT Set',
}

export type RoundModel = Model<IRound>;

export const roundSchema: Schema = new Schema<IRound, RoundModel>({
  setList: {type: [[setSchema]], default: []},
  roundSetType: {
    type: String,
    enum: RoundSetType,
    default: RoundSetType.singleSet,
  },
});

const Round = mongoose.model<IRound, RoundModel>('Round', roundSchema);

export default Round;
