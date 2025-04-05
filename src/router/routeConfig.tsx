import { RouteObject, Navigate, Outlet } from 'react-router-dom';

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
import AddTestPage from '../pages/AddTestPage';
import AdminPage from '../pages/AdminPage';
import AdminUniversitiesPage from '../pages/AdminUniversitiesPage';
import AdminBuildingsPage from '../pages/AdminBuildingPage';
import AdminFlowsPage from '../pages/AdminFlowsPage';
import AdminEntityPage from '../pages/AdminEntityPage';

type RouteType = RouteObject & {
  requiredAuth: boolean;
};

const AdminEntityPageWrapper = ({ entityType }: { entityType: string }) => {
  return <AdminEntityPage key={entityType} entityType={entityType} />;
};

const routeConfig: RouteType[] = [
  {
    path: '/admin',
    element: <AdminPage />,
    children: [
      {
        path: 'universities',
        element: <AdminEntityPageWrapper entityType="universities" />,
      },
      {
        path: 'users',
        element: <AdminEntityPageWrapper entityType="buildings" />,
      },
      {
        path: 'universities/:universityId/buildings',
        element: <AdminEntityPageWrapper entityType="buildings" />,
      },
      {
        path: 'universities/:universityId/buildings/:buildingId/audiences',
        element: <AdminEntityPageWrapper entityType="audiences" />,
      },
      {
        path: 'universities/:universityId/flows',
        element: <AdminEntityPageWrapper entityType="flows" />,
      },
    ],
    requiredAuth: false,
  },

  {
    path: '/intensives',
    element: <IntensivesPage />,
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
