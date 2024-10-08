// import { UserDomain } from '../models/domain/user-domain.model';
// import User from '../models/user.model';

// export const getWorkout = async (req: any, user: UserDomain) => {
//   const { employees, jobsites, startDate, endDate, status, search } = req.query;

//   const baseQuery: any = {};
//   let query: any[] = [];

//   if (startDate) {
//     query.push({ date: { $gte: new Date(startDate) } });
//   }

//   if (endDate) {
//     const searchDate = new Date(endDate);
//     searchDate.setHours(24, 59, 59);
//     query.push({ date: { $lte: new Date(searchDate) } });
//   }

//   if (employees) {
//     query.push({ employee: { $in: employees.split(',').map((j: string) => j.trim()) } });
//   }

//   if (jobsites) {
//     query.push({ 'jobsite._id': { $in: jobsites.split(',').map((j: string) => j.trim()) } });
//   }

//   if (status) {
//     baseQuery.status = status;
//   }

//   if (search) {
//     // get matching user IDs
//     const matchingUsers = await User.find({
//       $or: [
//         { 'firstName': { $regex: new RegExp(search, 'i') } },
//         { 'lastName': { $regex: new RegExp(search, 'i') } },
//       ],
//     }).then(res => res.map(u => u.id));

//     query.push({
//       $or: [
//         { 'employee': { $in: matchingUsers } },
//         { 'jobsite.name': { $regex: new RegExp(search, 'i') } },
//         { 'jobsite.city': { $regex: new RegExp(search, 'i') } },
//       ],
//     });
//   }

//   if (user.getIsAdmin()) {
//     if (query.length > 0) {
//       return { $and: query, ...baseQuery };
//     }
//     return { ...baseQuery };
//   }

//   // Supervisor query
//   if (user.getIsSupervisor()) {
//     query.push({ 'jobsite._id': { $in: user.jobsites } });
//   }

//   // Employee query
//   if (user.getIsEmployee()) {
//     query.push({ employee: user._id });
//   }

//   if (query.length > 0) {
//     return { $and: query, ...baseQuery };
//   }
//   return { ...baseQuery };
// };

// // export const validateNewRecord = async (req: any): Promise<string[]> => {
// //   const { employee, startTime, endTime, jobsite, date } = req.body;

// //   const errorMessages: string[] = [];

// //   const validatedJobsite = await Jobsite.findById(jobsite._id);
// //   if (!validatedJobsite) errorMessages.push('Invalid jobsite');

// //   const validatedUser = await User.findById(employee);
// //   if (!validatedUser) errorMessages.push('Invalid employee');

// //   if (!startTime) errorMessages.push('Invalid start time');

// //   if (!endTime) errorMessages.push('Invalid end time');

// //   if (!date) errorMessages.push('Invalid date');

// //   return errorMessages;
// // };
