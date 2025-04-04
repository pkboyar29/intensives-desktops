export interface IStudentRole {
  id: number;
  name: string;
}

export interface IStudentRoleCreate {
  name: string;
}

export interface IStudentRolePatch {
  id: number;
  name?: string;
}
