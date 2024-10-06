export interface IUser {
  id: number;
  teacher_id: number | null;
  student_id: number | null;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  roleName: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignInResponse {
  access: string;
  refresh: string;
}
