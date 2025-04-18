import { ITeamShort } from './ITeam';

export interface IEducationRequest {
  id: number;
  subject: string;
  description?: string;
  team: ITeamShort;
  // ownerName: string;
  status: 'Открыт' | 'Закрыт';
  createdDate: Date;
}

// TODO: добавить интерфейс для создания образовательного запроса
