import { IAudience } from './IAudience';
import { ICriteria } from './ICriteria';
import { IMarkStrategy } from './IMarkStrategy';
import { ITeacher } from './ITeacher';
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
  stageId: number | null;
  teams: ITeamForManager[];
  teachers: ITeacher[];
  markStrategy: IMarkStrategy | null;
  criterias: ICriteria[];
  visibility: boolean;
}

export interface IEventCreate {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  stageId: number | null;
  audienceId: number;
  visibility: boolean;
  intensiveId: number;
  teamIds: number[];
  teacherIds: number[];
  markStrategyId: number | null;
  criteriaIds: number[];
}

export interface IEventUpdate extends IEventCreate {
  eventId: number;
}
