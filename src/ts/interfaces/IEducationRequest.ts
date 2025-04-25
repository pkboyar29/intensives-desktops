import { ITeamShort } from './ITeam';

export interface IEducationRequest {
  id: number;
  subject: string;
  description?: string;
  team: ITeamShort;
  status: 'Открыт' | 'Закрыт';
  createdDate: Date;
  updatedDate: Date;
  answer: IEducationRequestAnswer | null;
}

export const defaultEducationRequest: IEducationRequest = {
  id: 0,
  subject: '',
  description: '',
  team: { id: 0, position: 0, name: '' },
  status: 'Открыт',
  createdDate: new Date(),
  updatedDate: new Date(),
  answer: null,
};

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

// TODO: начать хранить createdDate
export interface IEducationRequestAnswer {
  id: number;
  comment: string;
  managerId: number;
}

export interface IEducationRequestAnswerSubmit {
  comment: string;
  requestId: number;
}

export interface IEducationRequestAnswerUpdate {
  comment: string;
  answerId: number;
}
