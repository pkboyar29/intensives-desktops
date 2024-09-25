export interface ITeam {
  id: number;
  name: string;
  tutorId: number | null;
  tutorNameSurname: string | null;
  mentorId: number | null;
  mentorNameSurname: string | null;
  intensiveId: number;
}

export interface ITeamToChoose {
  id: number;
  name: string;
}
