import { RouteObject, Navigate } from 'react-router-dom';

import TeacherMainPage from '../pages/MainPages/TeacherMainPage';
import StudentMainPage from '../pages/MainPages/StudentMainPage';
import ManagerMainPage from '../pages/MainPages/ManagerMainPage';

import NotFoundPage from '../pages/NotFoundPage';
import SignInPage from '../pages/SignInPage';
import IntensivesPage from '../pages/IntensivesPage';
import EventPage from '../pages/EventPage';
import TeamEvaluationPage from '../pages/TeamEvaluationPage';
import TeamOverviewPage from '../pages/TeamOverviewPage';
import EvaluationIntensivePage from '../pages/EvaluationIntensivePage';
import IntensiveStatisticsPage from '../pages/IntensiveStatisticsPage';
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage';
import TeamsPage from '../pages/TeamsPage';
import CreateTeamsPage from '../pages/CreateTeamsPage';
import CreateSupportTeamsPage from '../pages/CreateSupportTeamsPage';
import ManageIntensiveForm from '../components/forms/ManageIntensiveForm';
import SchedulePage from '../pages/SchedulePage';
import ManageEventForm from '../components/forms/ManageEventForm';
import KanbanBoardPage from '../pages/KanbanBoardPage';
import AddTestPage from '../pages/AddTestPage';
import AdminPage from '../pages/AdminPage';

type RouteType = RouteObject & {
  requiredAuth: boolean;
};

const routeConfig: RouteType[] = [
  {
    path: '/admin',
    element: <AdminPage />,
    requiredAuth: false,
  },
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
        path: 'schedule',
        element: <SchedulePage />,
      },
      {
        path: 'schedule/:eventId',
        element: <EventPage />,
      },
      {
        path: 'team-evaluation/:eventId/:teamId',
        element: <TeamEvaluationPage />,
      },
      {
        path: 'team-overview',
        element: <TeamOverviewPage />,
      },
      {
        path: 'kanban',
        element: <KanbanBoardPage />,
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
        path: 'teams',
        element: <TeamsPage />,
      },
      {
        path: 'team-overview',
        element: <TeamOverviewPage />,
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
        path: 'kanban',
        element: <KanbanBoardPage />,
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
        element: <IntensiveOverviewPage />,
      },
      {
        path: 'editIntensive',
        element: <ManageIntensiveForm />,
      },
      {
        path: 'teams',
        element: <TeamsPage />,
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
    path: '/addTest',
    element: <AddTestPage />,
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
