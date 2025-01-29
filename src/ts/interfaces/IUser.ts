// TODO: вместо teacher_id и student_id юзать teacherId и studentId
export interface IUser {
  id: number;
  teacher_id: number | null;
  student_id: number | null;
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
