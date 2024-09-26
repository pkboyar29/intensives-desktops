import { ITeam } from './ITeam';

export interface IEvent {
  id: number;
  name: string;
  description: string;
  stageId: number;
  stageName: string;
  startDate: Date;
  finishDate: Date;
  auditoryId: number;
  auditoryName: string;
  markStrategyId: number;
  markStrategyName: string;
  resultTypeId: number;
  criterias: number[];
  criteriasNames: string[];
  teams: ITeam[];
  teachers_command: number[];
  isCurrentTeacherJury: boolean;
}

export interface IManagerEvent {
  id: number;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  audience: number;
  stage: number;
}

export interface IEventCreate {
  name: string;
  description: string;
  start_dt: string;
  finish_dt: string;
  stage: number;
  auditory: number;
  mark_strategy?: any;
  result_type?: any;
  intensiv: number;
  commands?: any[];
  teachers_command?: any[];
}

export interface IEventUpdate extends IEventCreate {
  eventId: number;
}
