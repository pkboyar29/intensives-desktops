import { IUser } from '../ts/interfaces/IUser';

export const isUserStudent = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Student';

export const isUserTeacher = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Teacher';

export const isUserManager = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Manager';

export const isUserAdmin = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Admin';

export const isUserMentor = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Mentor';
