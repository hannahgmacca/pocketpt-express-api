import { Types } from 'mongoose';
import { IRole } from '../role.model';
import { IUser } from '../user.model';

export class UserDomain implements IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  activeWorkout: Types.ObjectId | null;

  constructor(user: IUser) {
    this._id = user._id;
    this.email = user.email;
    this.password = user.password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.activeWorkout = user.activeWorkout
  }
}
