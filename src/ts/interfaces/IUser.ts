export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  notificationDisabled: boolean;
  roles: UserRole[];
  currentRole: UserRole | null;
}

export const UserRoleMap = {
  Admin: 'Администратор',
  Manager: 'Организатор',
  Teacher: 'Преподаватель',
  Student: 'Студент',
  Mentor: 'Наставник',
} as const;

export type UserRoleKey = keyof typeof UserRoleMap;

export type UserRole = {
  name: keyof typeof UserRoleMap;
  displayName: (typeof UserRoleMap)[keyof typeof UserRoleMap];
};

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignInResponse {
  access: string;
  refresh: string;
}

export interface IChangePassword {
  oldPassword: string;
  password: string;
}

export interface IUserAdmin {
  id: number;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  email: string;
  resetPassword?: boolean;
  roles?: UserRole[];
}

export interface IUserRegister {
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
}

export interface IUserPatch {
  id: number;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  email?: string;
  resetPassword?: boolean;
}

export interface IUploadXlsxError {
  rowId: string | number;
  errorInfo: string;
}
