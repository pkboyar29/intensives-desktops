export interface IUser {
  id: number;
  teacherId: number | null;
  studentId: number | null;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  roleNames: ('Студент' | 'Администратор' | 'Преподаватель' | 'Организатор')[];
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignInResponse {
  access: string;
  refresh: string;
}
