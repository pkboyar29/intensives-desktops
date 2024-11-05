import { ITeam } from './ITeam';

// delete?
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
  startDate: string;
  finishDate: string;
  startTime: string;
  finishTime: string;
  audience: number;
  stage: number;
}

// commands - teams
// teachers_command - teachersTeam
// mark_strategy - markStrategy. and this is number, not any?
export interface IEventCreate {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  finishDate: string;
  finishTime: string;
  stage: number | null;
  auditory: number;
  mark_strategy?: any;
  intensiveId: number;
  commands?: any[];
  teachers_command?: any[];
}

export interface IEventUpdate extends IEventCreate {
  eventId: number;
}
