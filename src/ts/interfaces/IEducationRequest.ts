import { ITeamShort } from './ITeam';

// TODO: добавить ответ
export interface IEducationRequest {
  id: number;
  subject: string;
  description?: string;
  team: ITeamShort;
  status: 'Открыт' | 'Закрыт';
  createdDate: Date;
  updatedDate: Date;
}

export interface IEducationRequestSend {
  subject: string;
  description?: string;
  intensiveId: number;
}

export interface IEducationRequestUpdate {
  subject: string;
  description?: string;
  requestId: number;
}

export interface IEducationRequestChangeStatus {
  status: 'OPENED' | 'CLOSED';
  requestId: number;
}

export interface IEducationRequestAnswer {
  comment: string;
  managerId: number;
}
