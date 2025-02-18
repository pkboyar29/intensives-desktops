import { IUser, UserRoleMap } from '../ts/interfaces/IUser';

// TODO: скорее всего удалить все утилитарные функции тут, потому что я буду сравнивать текущую роль

const isUserRole = (user: IUser, role: keyof typeof UserRoleMap): boolean => {
  return user.roles.some((r) => r.name === role);
};

export const isUserStudent = (user: IUser): boolean => {
  return isUserRole(user, 'Student');
};
export const isUserTeacher = (user: IUser): boolean => {
  return isUserRole(user, 'Teacher');
};
export const isUserManager = (user: IUser): boolean => {
  return isUserRole(user, 'Manager');
};
export const isUserAdmin = (user: IUser): boolean => {
  return isUserRole(user, 'Admin');
};

// TODO: а нужно ли?
export const isUserMentor = (user: IUser): boolean => {
  return isUserRole(user, 'Mentor');
};
