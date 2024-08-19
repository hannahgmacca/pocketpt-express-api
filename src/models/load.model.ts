import { Schema } from 'mongoose';
import { IRound } from './round.model';

export type PersonalBestRounds = LoadTypes<IRound>;
export type PerformanceLoad = LoadTypes<number>;
export type IsBestEffortLoad = LoadTypes<boolean>;
export type LoadTypes<T> = { weightKg: T; volumeKg: T };

// Schema for performanceLoadSchema
export const performanceLoadSchema: Schema = new Schema({
  weightKg: { type: Number, required: true },
  volumeKg: { type: Number, required: true },
}, { _id: false }); // _id: false to avoid creating an _id for subdocument

// Schema for IsBestEffortLoadSchema
export const IsBestEffortLoadSchema: Schema = new Schema({
  weightKg: { type: Boolean, required: true },
  volumeKg: { type: Boolean, required: true },
}, { _id: false }); // _id: false to avoid creating an _id for subdocument


