import mongoose, { Model, Schema, Types } from 'mongoose';
import { ISet, setSchema } from './set.model';
import { IExerciseHistory } from './exercise-history.model';

export interface IRound {
  _id: Types.ObjectId;
  setList: ISet[][];
  roundSetType: RoundSetType;
}

export interface IActiveRound extends IRound {
  exerciseHistory: IExerciseHistory[]
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

export const personalBestRoundSchema: Schema = new Schema({
  weightKg: roundSchema,
  volumeKg: roundSchema,
}, { _id: false }); // _id: false to avoid creating an _id for subdocumen

export default Round;
