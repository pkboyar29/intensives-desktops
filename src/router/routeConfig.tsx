import { RouteObject, Navigate } from 'react-router-dom'; // Импортируются компоненты-страницы и формы, которые будут использоваться как содержимое маршрутов

import SignInPage from '../pages/SignInPage';
import IntensivesPage from '../pages/IntensivesPage';
import IntensiveMainPage from '../pages/IntensiveMainPage';
import NotFoundPage from '../pages/NotFoundPage';

import EventPage from '../pages/EventPage';
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
import QuestionsPage from '../pages/QuestionsPage';
import AdminPage from '../pages/AdminPage';
import TestsPage from '../pages/TestsPage';
import CreateTestPage from '../pages/CreateTestPage';
import EditTestPage from '../pages/EditTestPage'; // Импортируются страницы и компоненты, которые будут использоваться в маршрутах
import InteniveTests from '../pages/IntensiveTests'; // Импортируется страница с тестами для интенсива

type RouteType = RouteObject & {
  requiredAuth: boolean;
}; // Создаётся расширенный тип маршрута, включающий поле requiredAuth, чтобы дополнительно контролировать доступ (например, через middleware или обёртку роутера)

const routeConfig: RouteType[] = [
  {
    path: '/admin',
    element: <AdminPage />,
    requiredAuth: false,
  },
  {
    path: '/intensives',
    element: <IntensivesPage />,
    requiredAuth: false,
  },
  {
    path: '/questions',
    element: <QuestionsPage />,
    requiredAuth: false,
  },
  {
    path: '/intensives/:intensiveId',
    element: <IntensiveMainPage />,
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
        path: 'team-overview',
        element: <TeamOverviewPage />,
      },
      {
        path: 'kanban',
        element: <KanbanBoardPage />,
      },
      {
        path: 'editIntensive',
        element: <ManageIntensiveForm />,
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
        path: 'schedule/editEvent',
        element: <ManageEventForm />,
      },
      {
        path: 'statistics',
        element: <IntensiveStatisticsPage />,
      },
      {
        path: 'tests',
        element: <InteniveTests/>
      }
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
    path: '/sign-in',
    element: <SignInPage />,
    requiredAuth: false,
  },
  {
    path: '/tests',
    element: <TestsPage />,
    requiredAuth: false,
  },
  {
    path: 'createTestPage',
    element: <CreateTestPage/>,
    requiredAuth: false,
  },
  {
    path: '/tests/:testId',
    element: <EditTestPage />,
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
