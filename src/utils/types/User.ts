export type User = {
  id: number;
  teacher_id: number | null;
  student_id: number | null;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  user_role_id: number;
};
