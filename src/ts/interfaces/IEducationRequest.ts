import { ITeamShort } from './ITeam';

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
