export interface ITaskTableRow {
  name: string;
  assignee: number; //массив так то
  finish_dt: Date;
  status: string; //может и number и обрабатывать название при создании строки
}

export interface ITask {
  name: string;
  desc: string;
  finish_dt: Date;
}
