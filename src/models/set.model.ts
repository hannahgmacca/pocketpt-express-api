import mongoose, { Model, Schema, Types } from 'mongoose';
import { exerciseSchema, IExercise } from './exercise.model';
import { IsBestEffortLoad, IsBestEffortLoadSchema } from './load.model';

export interface ISet {
  exercise: IExercise;
  repCount: number;
  weightKg: number;
  totalVolumeKg: number;
  isPersonalBest: IsBestEffortLoad;
}

export type SetModel = Model<ISet>;

export const setSchema: Schema = new Schema<ISet, SetModel>({
  exercise: exerciseSchema,
  repCount: Number,
  weightKg: Number,
  totalVolumeKg: Number,
  isPersonalBest: { type: IsBestEffortLoadSchema, required: false },
});

const Set = mongoose.model<ISet, SetModel>('Set', setSchema);

export default Set;
