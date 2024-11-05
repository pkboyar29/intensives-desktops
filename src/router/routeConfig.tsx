import { RouteObject, Navigate } from 'react-router-dom';

import TeacherMainPage from '../pages/MainPages/TeacherMainPage';
import StudentMainPage from '../pages/MainPages/StudentMainPage';
import ManagerMainPage from '../pages/MainPages/ManagerMainPage';

import NotFoundPage from '../pages/NotFoundPage';
import SignInPage from '../pages/SignInPage';
import IntensivesPage from '../pages/IntensivesPage';
import EventsPage from '../pages/EventsPage';
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage';
import TeamsPage from '../pages/TeamsPage';
import EventPage from '../pages/EventPage';
import TeamEvaluationPage from '../pages/TeamEvaluationPage';
import TeamOverviewPage from '../pages/TeamOverviewPage';
import StudentTasksBoardPage from '../pages/StudentTasksBoardPage';
import StudentTasksPage from '../pages/StudentTasksPage';
import StudentTaskAnswerPage from '../pages/StudentTaskAnswerPage';
import EvaluationIntensivePage from '../pages/EvaluationIntensivePage';

import IntensiveStatisticsPage from '../pages/IntensiveStatisticsPage';
import ManagerIntensiveOverviewPage from '../pages/ManagerIntensiveOverviewPage';
import ManagerTeamsPage from '../pages/ManagerTeamsPage';
import CreateTeamsPage from '../pages/CreateTeamsPage';
import CreateSupportTeamsPage from '../pages/CreateSupportTeamsPage';
import ManageIntensiveForm from '../components/forms/ManageIntensiveForm';
import ManageRolesPage from '../pages/ManageRolesPage';
import SchedulePage from '../pages/SchedulePage';
import ManageEventForm from '../components/forms/ManageEventForm';

type RouteType = RouteObject & {
  requiredAuth: boolean;
};

const routeConfig: RouteType[] = [
  {
    path: '/teacher/:intensiveId',
    element: <TeacherMainPage />,
    children: [
      {
        path: 'overview',
        element: <IntensiveOverviewPage />,
      },
      {
        path: 'teams',
        element: <TeamsPage />,
      },
      {
        // TODO: переименовать на schedule
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:eventId',
        element: <EventPage />,
      },
      {
        path: 'team-evaluation/:eventId/:teamId',
        element: <TeamEvaluationPage />,
      },
    ],
    requiredAuth: false,
  },
  {
    path: '/student/:intensiveId',
    element: <StudentMainPage />,
    children: [
      {
        path: 'overview',
        element: <IntensiveOverviewPage />,
      },
      {
        path: 'team-overview',
        element: <TeamOverviewPage />,
      },
      {
        // TODO: переименовать на schedule
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:eventId',
        element: <EventPage />,
      },
      {
        path: 'tasks-board',
        element: <StudentTasksBoardPage />,
      },
      {
        path: 'tasks',
        element: <StudentTasksPage />,
      },
      {
        path: 'task/:taskId',
        element: <StudentTaskAnswerPage />,
      },
    ],
    requiredAuth: false,
  },
  {
    path: '/manager/:intensiveId',
    element: <ManagerMainPage />,
    children: [
      {
        path: 'overview',
        element: <ManagerIntensiveOverviewPage />,
      },
      {
        path: 'editIntensive',
        element: <ManageIntensiveForm />,
      },
      {
        path: 'teams',
        element: <ManagerTeamsPage />,
      },
      {
        path: 'createTeams',
        element: <CreateTeamsPage />,
      },
      {
        path: 'createSupportTeams',
        element: <CreateSupportTeamsPage />,
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
      },
      {
        path: 'schedule/:eventId',
        element: <EventPage />,
      },
      {
        path: 'schedule/editEvent',
        element: <ManageEventForm />,
      },
      {
        path: 'manageRoles',
        element: <ManageRolesPage />,
      },

      {
        path: 'statistics',
        element: <IntensiveStatisticsPage />,
      },
    ],
    requiredAuth: false,
  },
  {
    path: '/createIntensive',
    element: <ManageIntensiveForm />,
    requiredAuth: false,
  },
  {
    path: '/evaluation',
    element: <EvaluationIntensivePage />,
    requiredAuth: false,
  },
  {
    path: '/intensives',
    element: <IntensivesPage />,
    requiredAuth: false,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
    requiredAuth: false,
  },
  {
    path: '/',
    element: <Navigate to="/sign-in" />,
    requiredAuth: false,
  },
  {
    path: '*',
    element: <NotFoundPage />,
    requiredAuth: false,
  },
];

export default routeConfig;
