import { UserRole } from '../ts/interfaces/IUser';

export const isCurrentRoleStudent = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Student';
};
export const isCurrentRoleTeacher = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Teacher';
};
export const isCurrentRoleManager = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Manager';
};
export const isCurrentRoleAdmin = (currentRole: UserRole): boolean => {
  return currentRole.name === 'Admin';
};
