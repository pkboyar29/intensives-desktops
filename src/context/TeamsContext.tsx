import { FC, ReactNode, createContext, useState } from 'react';
import axios from 'axios';

import { ITeam } from '../ts/interfaces/ITeam';
import authHeader from '../helpers/getHeaders';

interface TeamsContextType {
  teams: ITeam[];
  getTeams: (intensiveId: number) => void;
  getCurrentTeamForStudent: (studentId: number) => Promise<ITeam>;
  currentTeam: ITeam;
  setCurrentTeamForStudent: (teamId: number) => void;
  getTeamById: (teamId: number) => Promise<ITeam>;
}

export const TeamsContext = createContext<TeamsContextType>({
  teams: [],
  getTeams: () => {},
  getCurrentTeamForStudent: async () =>
    Promise.resolve({
      id: 0,
      name: '',
      tutorId: null,
      tutorNameSurname: null,
      mentorId: null,
      mentorNameSurname: null,
      intensiveId: 0,
    }),
  currentTeam: {
    id: 0,
    name: '',
    tutorId: null,
    tutorNameSurname: null,
    mentorId: null,
    mentorNameSurname: null,
    intensiveId: 0,
  },
  setCurrentTeamForStudent: () => {},
  getTeamById: async () =>
    Promise.resolve({
      id: 0,
      name: '',
      tutorId: null,
      tutorNameSurname: null,
      mentorId: null,
      mentorNameSurname: null,
      intensiveId: 0,
    }),
});

interface TeamsContextProviderProps {
  children: ReactNode;
}

const TeamsProvider: FC<TeamsContextProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [currentTeam, setCurrentTeam] = useState<ITeam>({
    id: 0,
    name: '',
    tutorId: null,
    tutorNameSurname: null,
    mentorId: null,
    mentorNameSurname: null,
    intensiveId: 0,
  });

  const mapTeams = async (unmappedTeams: any[]): Promise<ITeam[]> => {
    const mappedTeams = await Promise.all(
      unmappedTeams.map(async (unmappedTeam: any) => mapTeam(unmappedTeam))
    );

    return mappedTeams;
  };

  const mapTeam = async (unmappedTeam: any): Promise<ITeam> => {
    let tutorNameSurname = 'Нету';
    let mentorNameSurname = 'Нету';

    if (unmappedTeam.tutor) {
      const tutorResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/teachers/${unmappedTeam.tutor}`,
        { headers: await authHeader() }
      );
      tutorNameSurname = `${
        tutorResponse.data.user.last_name
      } ${tutorResponse.data.user.first_name.charAt(
        0
      )}.${tutorResponse.data.user.middle_name.charAt(0)}.`;
    }
    if (unmappedTeam.mentor) {
      const mentorResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/students/${unmappedTeam.mentor}`,
        { headers: await authHeader() }
      );
      mentorNameSurname = `${
        mentorResponse.data.user.last_name
      } ${mentorResponse.data.user.first_name.charAt(
        0
      )}.${mentorResponse.data.user.middle_name.charAt(0)}.`;
    }

    try {
      return {
        id: unmappedTeam.id,
        name: unmappedTeam.name,
        tutorId: unmappedTeam.tutor,
        mentorId: unmappedTeam.mentor,
        tutorNameSurname: tutorNameSurname,
        mentorNameSurname: mentorNameSurname,
        intensiveId: unmappedTeam.intensive,
      };
    } catch (e) {
      console.log(e);
      return {
        id: 0,
        name: 'Unknown',
        tutorId: 0,
        mentorId: 0,
        tutorNameSurname: 'Unknown',
        mentorNameSurname: 'Unknown',
        intensiveId: 0,
      };
    }
  };

  const getTeams = async (intensiveId: number) => {
    const allTeamsResponse = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/commands_on_intensives/`,
      { headers: await authHeader() }
    );
    const allTeams = allTeamsResponse.data.results;
    const ourIntensiveTeams = allTeams.filter(
      (team: any) => team.intensive === intensiveId
    );
    const mappedTeams: ITeam[] = await mapTeams(ourIntensiveTeams);
    setTeams(mappedTeams);
  };

  const getTeamById = async (teamId: number): Promise<ITeam> => {
    const teamResponse = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/commands_on_intensives/${teamId}/`,
      { headers: await authHeader() }
    );
    const unmappedTeam = teamResponse.data;

    const mappedTeam: Promise<ITeam> = mapTeam(unmappedTeam);
    return mappedTeam;
  };

  // что возвращать, если текущей команды для студента нет, надо тут что-то возвращать и сообщать о том, что на данный момент нет никаких открытых интенсивов
  // например возвращать 0
  const getCurrentTeamForStudent = async (
    studentId: number
  ): Promise<ITeam> => {
    const studentsWithRolesResponse = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/role_of_students_on_intensives`,
      { headers: await authHeader() }
    );
    const allStudentsWithRoles = studentsWithRolesResponse.data.results;

    // тут конечно надо отфильтровать эти записи по тем, где команды в открытых интенсивах, ну вообще это на беке должно быть
    const currentStudentWithRoleAndTeam = allStudentsWithRoles.find(
      (studentWithRole: any) => studentWithRole.student === studentId
    );
    const currentTeamId = currentStudentWithRoleAndTeam.command;

    const currentTeamPromise: Promise<ITeam> = getTeamById(currentTeamId);
    return await currentTeamPromise;
  };

  const setCurrentTeamForStudent = async (teamId: number) => {
    const currentTeamForTeamId = await getTeamById(teamId);
    setCurrentTeam(currentTeamForTeamId);
  };

  return (
    <TeamsContext.Provider
      value={{
        teams,
        getTeams,
        getCurrentTeamForStudent,
        currentTeam,
        setCurrentTeamForStudent,
        getTeamById,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};

export default TeamsProvider;
