import mongoose, { Model, Schema, Types } from 'mongoose';
import { exerciseSchema, IExercise } from './exercise.model';

export interface ISet {
  exercise: IExercise;
  repCount: number;
  weightKg: number;
}

export type SetModel = Model<ISet>;

export const setSchema: Schema = new Schema<ISet, SetModel>({
  exercise: exerciseSchema,
  repCount: Number,
  weightKg: Number,
});

const Set = mongoose.model<ISet, SetModel>('Set', setSchema);

export default Set;