/* eslint-disable @typescript-eslint/lines-between-class-members */
import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  activeWorkout: Types.ObjectId | null
}

export type UserModel = Model<IUser>;

export const userSchema: Schema = new Schema<IUser, UserModel>({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  activeWorkout: {
    type: mongoose.Schema.Types.ObjectId ,
    ref: "Workout"
  },
});

const User: UserModel = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
