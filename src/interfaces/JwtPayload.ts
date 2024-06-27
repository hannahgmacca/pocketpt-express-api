import { ObjectId } from 'mongoose';
// import { RoleModel } from '../models/role.model';

export interface JwtPayload {
  _id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  //roles: RoleModel[];
}
