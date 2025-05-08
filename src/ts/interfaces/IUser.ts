export interface IUser {
  id: number;
  teacherId: number | null;
  studentId: number | null;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
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

export interface IUserAdmin {
  id: number;
  firstName: string;
  lastName: string;
  patronymic: string | null;
  email: string;
  password?: string | undefined;
  roles?: UserRole[];
}

export interface IUploadXlsxError {
  rowId: string | number;
  errorInfo: string;
}
