
export interface ITask {
  id_task: number;
  name: string;
  description: string | null;
  assignees: number[] | null;
  owner: number; //подумать над обязательностью полей
  column: number;
  parent_task: number | null;
  created_dt: Date;
  deadline_start_dt: Date | null;
  deadline_end_dt: Date  | null;
  position: number;
  is_completed: boolean;
  subtasks_count: number | null;
}

export interface ITaskCreate {
  name: string;
  column?: number;
  parent_task?: number;
}
