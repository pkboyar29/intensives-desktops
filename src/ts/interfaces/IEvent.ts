import { IAudience } from './IAudience';
import { IEventCriteria } from './ICriteria';
import { IMarkStrategy } from './IMarkStrategy';
import { ITeacherEvent } from './ITeacher';
import { ITeam, ITeamForManager } from './ITeam';

// TODO: delete after i delete all event context?
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
  startDate: Date;
  finishDate: Date;
  audience: IAudience;
  stageId: number;
  teams: ITeamForManager[];
  experts: ITeacherEvent[];
  markStrategy: IMarkStrategy | null;
  criterias: IEventCriteria[];
}

export interface IEventCreate {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  finishDate: string;
  finishTime: string;
  stage: number | null;
  audience: number;
  intensiveId: number;
  teamIds: number[];
  teacherOnIntensiveIds: number[];
  markStrategy?: number;
  criteriaIds?: number[];
}

export interface IEventUpdate extends IEventCreate {
  eventId: number;
}
