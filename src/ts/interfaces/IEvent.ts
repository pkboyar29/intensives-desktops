import { IAudience } from './IAudience';
import { ICriteria } from './ICriteria';
import { IFile } from './IFile';
import { IMarkStrategy } from './IMarkStrategy';
import { ITeacher } from './ITeacher';
import { ITeam } from './ITeam';

export interface IEvent {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  finishDate: Date;
  audience: IAudience;
  stageId: number | null;
  teams: ITeam[];
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
  audienceId: number;
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
