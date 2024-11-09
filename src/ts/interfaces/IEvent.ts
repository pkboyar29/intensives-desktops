import { IAudience } from './IAudience';
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
  startDate: string;
  finishDate: string;
  startTime: string;
  finishTime: string;
  audience: IAudience;
  stageId: number;
  teams: ITeamForManager[];
  experts: ITeacherEvent[];
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
  markStrategy?: number;
  intensiveId: number;
  teamIds: number[];
  teacherOnIntensiveIds: number[];
}

export interface IEventUpdate extends IEventCreate {
  eventId: number;
}
