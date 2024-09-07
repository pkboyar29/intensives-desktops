import { RouteObject, Navigate } from 'react-router-dom';

import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import IntensivesPage from '../pages/IntensivesPage/IntensivesPage';
import TeacherMainPage from '../pages/TeacherMainPage/TeacherMainPage';
import EventsPage from '../pages/EventsPage/EventsPage';
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage/IntensiveOverviewPage';
import TeamsPage from '../pages/TeamsPage/TeamsPage';
import EventOverviewPage from '../pages/EventOverviewPage/EventOverviewPage';
import TeamEvaluationPage from '../pages/TeamEvaluationPage/TeamEvaluationPage';
import StudentMainPage from '../pages/StudentMainPage/StudentMainPage';
import TeamOverviewPage from '../pages/TeamOverviewPage/TeamOverviewPage';
import StudentTasksBoardPage from '../pages/StudentTasksBoardPage/StudentTasksBoardPage';
import StudentTasksPage from '../pages/StudentTasksPage/StudentTasksPage';
import StudentTaskAnswerPage from '../pages/StudentTaskAnswerPage/StudentTaskAnswerPage';
import EvaluationIntensivePage from '../pages/EvaluationIntensivePage/EvaluationIntensivePage';

import StatisticsIntensive from '../pages/StatisticsIntensive';
import CreateEvent from '../pages/CreateEvent';
import ManageProfile from '../pages/ManageLists/ManageProfile';
import ManageRoles from '../pages/ManageLists/ManageRole';
import Commands from '../components/Commands';
import { Intensiv } from '../pages/Intensive';
import Plan from '../pages/Plan';
import ManageMenu from '../pages/ManageMenu';
import CreateCommand from '../pages/CreateCommand';
import ListCreateIntensiv from '../components/ListCreateIntensiv';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

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
  {
    path: '/manageMenu',
    element: <ManageMenu />,
    requiredAuth: false,
  },
  {
    path: '/plan',
    element: <Plan />,
    requiredAuth: false,
  },
  {
    path: '/createIntensive',
    element: <ListCreateIntensiv />,
    requiredAuth: false,
  },
  {
    path: '/intensiv',
    element: <Intensiv />,
    requiredAuth: false,
  },
  {
    path: '/commands',
    element: <Commands />,
    requiredAuth: false,
  },
  {
    path: '/createCom',
    element: (
      <DndProvider backend={HTML5Backend}>
        <CreateCommand />
      </DndProvider>
    ),
    requiredAuth: false,
  },
  {
    path: '/editRoles',
    element: <ManageRoles />,
    requiredAuth: false,
  },
  {
    path: '/editProfile',
    element: <ManageProfile />,
    requiredAuth: false,
  },
  {
    path: '/editEvent',
    element: <CreateEvent />,
    requiredAuth: false,
  },
  {
    path: '/statisticsIntensive',
    element: <StatisticsIntensive />,
    requiredAuth: false,
  },
];

export default routeConfig;
