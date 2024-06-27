import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IExercise {
  _id: Types.ObjectId;
  exerciseName: string;
  equipment: equipmentType;
  muscleGroup: muscleGroup
}

export interface IUserExercises {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  exercises: IExercise[];
}

export enum muscleGroup {
  none = 'none',
  bicep = 'bicep',
  tricep = 'tricep',
  calves = 'calves',
  chest = 'chest',
  back = 'back',
  shoulders = 'shoulders',
  quadriceps = 'quadriceps',
  hamstrings = 'hamstrings',
  glutes = 'glutes',
  abs = 'abs',
  forearms = 'forearms',
  traps = 'traps',
  lats = 'lats',
  obliques = 'obliques'
}

export enum equipmentType {
  none = 'none',
  machine = 'machine',
  barbell = 'barbell',
  dumbell = 'dumbell',
  stetchBand = 'stretchBand'
}

export type ExerciseModel = Model<IExercise>;

export const exerciseSchema: Schema = new Schema<IExercise, ExerciseModel>({
  exerciseName: String,
  equipment: {
    type: String,
    enum: equipmentType,
    default: equipmentType.none,
  },
  muscleGroup: {
    type: String,
    enum: muscleGroup,
    default: muscleGroup.none,
  },
});

const Exercise: ExerciseModel = mongoose.model<IExercise, ExerciseModel>('Exercise', exerciseSchema);

export default Exercise;
