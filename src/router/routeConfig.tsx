import { RouteObject, Navigate } from 'react-router-dom';

import TeacherMainPage from '../pages/MainPages/TeacherMainPage';
import StudentMainPage from '../pages/MainPages/StudentMainPage';
import ManagerMainPage from '../pages/MainPages/ManagerMainPage';

import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import IntensivesPage from '../pages/IntensivesPage/IntensivesPage';
import EventsPage from '../pages/EventsPage/EventsPage';
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage/IntensiveOverviewPage';
import TeamsPage from '../pages/TeamsPage/TeamsPage';
import EventOverviewPage from '../pages/EventOverviewPage/EventOverviewPage';
import TeamEvaluationPage from '../pages/TeamEvaluationPage/TeamEvaluationPage';
import TeamOverviewPage from '../pages/TeamOverviewPage/TeamOverviewPage';
import StudentTasksBoardPage from '../pages/StudentTasksBoardPage/StudentTasksBoardPage';
import StudentTasksPage from '../pages/StudentTasksPage/StudentTasksPage';
import StudentTaskAnswerPage from '../pages/StudentTaskAnswerPage/StudentTaskAnswerPage';
import EvaluationIntensivePage from '../pages/EvaluationIntensivePage/EvaluationIntensivePage';

import IntensiveStatisticsPage from '../pages/IntensiveStatisticsPage';
import ManagerTeamsPage from '../pages/ManagerTeamsPage';
import ManagerIntensiveOverviewPage from '../pages/ManagerIntensiveOverviewPage';
import CreateTeamsPage from '../pages/CreateTeamsPage';
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
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:eventId',
        element: <EventOverviewPage />,
      },
      {
        path: 'team-evaluation/:eventId/:teamId',
        element: <TeamEvaluationPage />,
      },
    ],
    requiredAuth: false,
  },
  {
    path: '/student/:teamId',
    element: <StudentMainPage />,
    children: [
      {
        path: 'overview',
        element: <TeamOverviewPage />,
      },
      {
        path: 'intensiv-overview',
        element: <IntensiveOverviewPage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:eventId',
        element: <EventOverviewPage />,
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
        path: 'createTeam',
        element: <CreateTeamsPage />,
      },
      {
        path: 'statistics',
        element: <IntensiveStatisticsPage />,
      },
      {
        path: 'plan',
        element: <SchedulePage />,
      },
      {
        path: 'manageRoles',
        element: <ManageRolesPage />,
      },
      {
        path: 'editEvent',
        element: <ManageEventForm />,
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
