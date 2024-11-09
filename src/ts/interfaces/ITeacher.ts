export interface ITeacher {
  id: number;
  name: string;
}

export interface ITeacherOnIntensive {
  id: number;
  teacherId: number;
  name: string;
}

export interface ITeacherEvent {
  id: number;
  teacherOnIntensiveId: number;
  teacherId: number;
  name: string;
}
