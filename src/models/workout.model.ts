import { IActiveRound, IRound, roundSchema } from './round.model';
import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IWorkout {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  workoutName: string;
  workoutType: WorkoutType;
  completedRoundList: IRound[];
  activeRound: IRound | null;
  caloriesBurnt: number;
  isActive?: boolean;
  startedDateTime?: Date;
  completedDateTime?: Date;
}

export interface IActiveWorkout {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  workoutName: string;
  workoutType: WorkoutType;
  completedRoundList: IRound[];
  activeRound: IActiveRound | null;
  caloriesBurnt: number;
  isActive?: boolean;
  startedDateTime?: Date;
  completedDateTime?: Date;
}

export interface WorkoutShort {
  workoutId: number;
  workoutName: string;
  workoutType: WorkoutType;
  caloriesBurnt: number;
  completedDateTime?: Date;
}

export enum WorkoutType {
  strength = 'strength',
  cardio = 'cardio',
  hiit = 'hiit',
}

export type WorkoutModel = Model<IWorkout>;

export const WorkoutSchema: Schema = new Schema<IWorkout, WorkoutModel>({
  workoutName: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  workoutType: {
    type: String,
    enum: WorkoutType,
    default: WorkoutType.strength,
  },
  completedRoundList: [roundSchema],
  activeRound: roundSchema,
  caloriesBurnt: Number,
  isActive: Boolean,
  startedDateTime: Date,
  completedDateTime: Date,
});

const Workout = mongoose.model<IWorkout, WorkoutModel>('Workout', WorkoutSchema);

export default Workout;
