import { IAudience } from './IAudience';
import { ICriteria } from './ICriteria';
import { IFile } from './IFile';
import { IMarkStrategy } from './IMarkStrategy';
import { ITeacher } from './ITeacher';
import { ITeamShort } from './ITeam';

export interface IEvent {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  finishDate: Date;
  audience: IAudience | null;
  isOnline: boolean;
  stageId: number | null;
  teams: ITeamShort[];
  teachers: ITeacher[];
  markStrategy: IMarkStrategy | null;
  deadlineDate: Date | null;
  criterias: ICriteria[];
  visibility: boolean;
  files: IFile[];
}

export interface IEventShort {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  finishDate: Date;
  audience: IAudience | null;
  isOnline: boolean;
  stageId: number | null;
  visibility: boolean;
  teamIds: number[];
  teacherIds: number[];
}

export interface IEventCreate {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  stageId: number | null;
  audienceId: number | null;
  isOnline: boolean;
  visibility: boolean;
  intensiveId: number;
  teamIds: number[];
  teacherIds: number[];
  markStrategyId: number | null;
  deadlineDate: string | null;
  criteriaIds: number[];
}

export interface IEventUpdate extends IEventCreate {
  eventId: number;
  fileIds?: number[];
}

export interface IEventUpdateVisibility {
  eventId: number;
  visibility: boolean;
}
