export interface IUser {
  id: number;
  teacher_id: number | null;
  student_id: number | null;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  roleId: number;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignInResponse {
  access: string;
  refresh: string;
}
