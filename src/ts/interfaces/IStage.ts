export interface IStage {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  finishDate: Date;
}

export interface IStageCreate {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  intensiveId: number;
}

export interface IStageUpdate {
  id: number;
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  intensiveId: number;
}
