import { FC, ReactNode, createContext, useState, useContext } from 'react';
import axios from 'axios';

import { CurrentUserContext } from './CurrentUserContext';

import { IEvent } from '../ts/interfaces/IEvent';
import { ITeam } from '../ts/interfaces/ITeam';
import { TeamsContext } from './TeamsContext';
import authHeader from '../helpers/getHeaders';

interface EventsContextType {
  events: IEvent[];
  currentEvent: IEvent | undefined;
  setEventsForIntensiv: (intensiveId: number) => Promise<IEvent[]>;
  setEventsForTeam: (teamId: number) => void;
  setCurrentEventById: (eventId: number) => void;
}

export const EventsContext = createContext<EventsContextType>({
  events: [],
  currentEvent: {
    id: 0,
    name: '',
    description: '',
    stageId: 0,
    stageName: '',
    startDate: new Date(),
    finishDate: new Date(),
    auditoryId: 0,
    auditoryName: '',
    markStrategyId: 0,
    markStrategyName: '',
    resultTypeId: 0,
    criterias: [0],
    criteriasNames: [],
    teams: [],
    teachers_command: [0],
    isCurrentTeacherJury: false,
  },
  setEventsForIntensiv: async () => [],
  setEventsForTeam: () => {},
  setCurrentEventById: () => {},
});

interface EventsContextProviderProps {
  children: ReactNode;
}
const EventsProvider: FC<EventsContextProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<IEvent | undefined>();
  const { currentUser } = useContext(CurrentUserContext);
  const { getTeamById } = useContext(TeamsContext);

  const mapEvents = async (unmappedEvents: any[]): Promise<IEvent[]> => {
    const mappedEvents = await Promise.all(
      unmappedEvents.map(async (unmappedEvent: any) => mapEvent(unmappedEvent))
    );
    return mappedEvents;
  };

  const mapEvent = async (unmappedEvent: any) => {
    try {
      const auditoryResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auditories/${
          unmappedEvent.auditory
        }`,
        { headers: await authHeader() }
      ); // получить auditoryName
      const stageResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/stages/${unmappedEvent.stage}`,
        { headers: await authHeader() }
      );
      const markStrategyResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/mark_strategy/${
          unmappedEvent.mark_strategy
        }`,
        { headers: await authHeader() }
      ); // получить markStrategyName
      const criteriasNamesPromises = unmappedEvent.criteria.map(
        async (criteria: number) => {
          const criteriaResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/criteria/${criteria}`,
            { headers: await authHeader() }
          );
          return criteriaResponse.data.name;
        }
      );
      const criteriasNames: string[] = await Promise.all(
        criteriasNamesPromises
      );

      const teams: ITeam[] = unmappedEvent.commands.map(
        async (teamId: number) => {
          const teamResponse = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/commands_on_intensives/${teamId}/`,
            { headers: await authHeader() }
          );
          return {
            id: teamId,
            name: teamResponse.data.name,
            tutorId: teamResponse.data.teacher,
            mentorId: teamResponse.data.tutor,
            tutorNameSurname: null,
            mentorNameSurname: null,
          };
        }
      );

      const resolvedTeams = await Promise.all(teams);

      let isCurrentTeacherJury: boolean = false;
      await Promise.all(
        unmappedEvent.teachers_command.map(async (teacherId: number) => {
          const teacherOnIntensiveResponse = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/teachers_on_intensives/${teacherId}/`,
            { headers: await authHeader() }
          );
          if (
            teacherOnIntensiveResponse.data.role === 4 &&
            teacherOnIntensiveResponse.data.teacher.user.id === currentUser?.id
          ) {
            isCurrentTeacherJury = true;
          }
        })
      );

      return {
        id: unmappedEvent.id,
        name: unmappedEvent.name,
        description: unmappedEvent.description,
        stageId: unmappedEvent.stage,
        stageName: stageResponse.data.name,
        startDate: new Date(unmappedEvent.start_dt),
        finishDate: new Date(unmappedEvent.finish_dt),
        auditoryId: unmappedEvent.auditory,
        auditoryName: auditoryResponse.data.name,
        markStrategyId: unmappedEvent.mark_strategy,
        markStrategyName: markStrategyResponse.data.name,
        resultTypeId: unmappedEvent.result_type,
        criterias: unmappedEvent.criteria,
        criteriasNames: criteriasNames,
        teams: resolvedTeams,
        teachers_command: unmappedEvent.teachers_command,
        isCurrentTeacherJury: isCurrentTeacherJury,
      };
    } catch (error) {
      console.log(error);
      return {
        id: 0,
        name: 'Unknown',
        description: 'Unknown',
        stageId: 0,
        stageName: 'Unknown',
        startDate: new Date(),
        finishDate: new Date(),
        auditoryId: 0,
        auditoryName: 'Unknown',
        markStrategyId: 0,
        markStrategyName: 'Unknown',
        resultTypeId: 0,
        criterias: [],
        criteriasNames: [],
        teams: [],
        teachers_command: [],
        isCurrentTeacherJury: false,
      };
    }
  };

  const setAndGetEventsForIntensiv = async (
    intensiveId: number
  ): Promise<IEvent[]> => {
    try {
      const eventsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/events/?intensiv=${intensiveId}`,
        { headers: await authHeader() }
      );
      const unmappedEvents = eventsResponse.data.results;

      const mappedEvents: IEvent[] = await mapEvents(unmappedEvents);
      setEvents(mappedEvents);

      return mappedEvents;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const setEventsForTeam = async (teamId: number): Promise<void> => {
    try {
      const team: Promise<ITeam> = getTeamById(teamId);

      const eventsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/events/?intensiv=${
          (
            await team
          ).intensiveId
        }`,
        { headers: await authHeader() }
      );
      const unmappedEvents = eventsResponse.data.results;
      const ourTeamEvents = unmappedEvents.filter((unmappedEvent: any) => {
        const eventTeams: any[] = unmappedEvent.commands;
        const isOurTeamInEvent = eventTeams.some(
          (eventTeam: any) => eventTeam === teamId
        );
        return isOurTeamInEvent;
      });

      const mappedEvents: IEvent[] = await mapEvents(ourTeamEvents);
      setEvents(mappedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  const setCurrentEventById = async (eventId: number): Promise<void> => {
    try {
      const eventResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/`,
        { headers: await authHeader() }
      );
      const unmappedEvent = eventResponse.data;
      const mappedEvent: IEvent = await mapEvent(unmappedEvent);
      setCurrentEvent(mappedEvent);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        currentEvent,
        setEventsForIntensiv: setAndGetEventsForIntensiv,
        setEventsForTeam,
        setCurrentEventById,
      }}
    >
      {' '}
      {children}{' '}
    </EventsContext.Provider>
  );
};

export default EventsProvider;
