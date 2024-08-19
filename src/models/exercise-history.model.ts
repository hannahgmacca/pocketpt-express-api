import mongoose, { Model, Schema, Types } from 'mongoose';
import {
  IsBestEffortLoad,
  IsBestEffortLoadSchema,
  PerformanceLoad,
  PersonalBestRounds,
  performanceLoadSchema,
} from './load.model';
import { IRound, personalBestRoundSchema, roundSchema } from './round.model';
import { IExercise, exerciseSchema } from './exercise.model';


export interface ExerciseHistoryRequest {
  userId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  exercise: IExercise;
  roundList: IRoundHistoricalItem[];
  personalBest: PerformanceLoad;
  personalBestRounds: PersonalBestRounds;
}

export interface IExerciseHistory {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  exercise: IExercise;
  roundList: IRoundHistoricalItem[];
  personalBest: PerformanceLoad;
  personalBestRounds: PersonalBestRounds;
}

export interface IRoundHistoricalItem {
  workoutId: Types.ObjectId;
  round: IRound;
  bestEffort: PerformanceLoad;
  wasPersonalBest: IsBestEffortLoad;
  completedDateTime: Date;
}

export class RoundHistoricalItem implements IRoundHistoricalItem {
  workoutId: Types.ObjectId;
  round: IRound;
  bestEffort: PerformanceLoad;
  wasPersonalBest: IsBestEffortLoad;
  completedDateTime: Date;
  
  constructor(
    round: IRound,
    workoutId: Types.ObjectId,
    completedDateTime: Date
  ) {
    this.workoutId = workoutId;
    this.round = round;
    this.completedDateTime = completedDateTime;
    this.bestEffort = {weightKg: 0, volumeKg: 0};
    this.wasPersonalBest = {weightKg: false, volumeKg: false};
  }
}

export type ExerciseHistoryModel = Model<IExerciseHistory>;

export type RoundHistoricalModel = Model<IRoundHistoricalItem>;

export const historicalRoundSchema: Schema = new Schema<IRoundHistoricalItem, RoundHistoricalModel>(
  {
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
    },
    round: Types.ObjectId,
    bestEffort: { type: performanceLoadSchema, required: false },
    wasPersonalBest: { type: IsBestEffortLoadSchema, required: false },
  },
  { _id: false },
);

export const exerciseHistorySchema: Schema = new Schema<IExerciseHistory, ExerciseHistoryModel>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
  },
  exercise: exerciseSchema,
  personalBestRounds: { type: personalBestRoundSchema, required: false },
  personalBest: { type: performanceLoadSchema, required: false },
  roundList: [historicalRoundSchema],
});

const ExerciseHistory: ExerciseHistoryModel = mongoose.model<IExerciseHistory, ExerciseHistoryModel>(
  'ExerciseHistory',
  exerciseHistorySchema,
);

export default ExerciseHistory;