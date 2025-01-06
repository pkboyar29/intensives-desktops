
export interface ITask {
  id: number,
  idTask: number;
  name: string;
  description: string | null;
  assignees: number[] | null;
  owner: number; //подумать над обязательностью полей
  column: number;
  parentTask: number | null;
  createdDt: Date;
  deadlineStartDt: Date | null;
  deadlineEndDt: Date  | null;
  position: number;
  isCompleted: boolean;
  subtasksCount: number | null;
}

export interface ITaskCreate {
  name: string;
  column?: number;
  parentTask?: number;
}
