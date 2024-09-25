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
