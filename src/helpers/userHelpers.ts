import { IUser, UserRole } from '../ts/interfaces/IUser';

export const isUserStudent = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Student';
};
export const isUserTeacher = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Teacher';
};
export const isUserManager = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Manager';
};
export const isUserAdmin = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Admin';
};
