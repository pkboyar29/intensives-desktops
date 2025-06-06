import { RouteObject, Navigate, Outlet } from 'react-router-dom';

import SignInPage from '../pages/SignInPage';
import IntensivesPage from '../pages/IntensivesPage';
import IntensiveMainPage from '../pages/IntensiveMainPage';
import NotFoundPage from '../pages/NotFoundPage';

import EventPage from '../pages/EventPage';
import TeamOverviewPage from '../pages/TeamOverviewPage';
import TeacherIntensiveMarksPage from '../pages/TeacherIntensiveMarksPage';
import ManagerIntensiveMarksPage from '../pages/ManagerIntensiveMarksPage';
import IntensiveStatisticsPage from '../pages/IntensiveStatisticsPage';
import IntensiveOverviewPage from '../pages/IntensiveOverviewPage';
import TeamsPage from '../pages/TeamsPage';
import CreateTeamsPage from '../pages/CreateTeamsPage';
import CreateSupportTeamsPage from '../pages/CreateSupportTeamsPage';
import ManageIntensiveForm from '../components/forms/ManageIntensiveForm';
import SchedulePage from '../pages/SchedulePage';
import ManageEventForm from '../components/forms/ManageEventForm';
import KanbanBoardPage from '../pages/KanbanBoardPage';
import EducationRequestsPage from '../pages/EducationRequestsPage';
import AddTestPage from '../pages/AddTestPage';
import AdminPage from '../pages/AdminPage';
import AdminEntityPage from '../pages/AdminEntityPage';
import { TableType } from '../tableConfigs';
import IntensiveAnswerPage from '../pages/IntensiveAnswerPage';

type RouteType = RouteObject & {
  requiredAuth: boolean;
};

const AdminEntityPageWrapper = ({ entityType }: { entityType: TableType }) => {
  return <AdminEntityPage key={entityType} entityType={entityType} />;
};

const routeConfig: RouteType[] = [
  {
    path: '/admin',
    element: <AdminPage />,
    children: [
      //можно все сделать одной функцией по последнему слову в url ?
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
      {
        path: 'universities/:universityId/flows/:flowId/groups',
        element: <AdminEntityPageWrapper entityType="groups" />,
      },
      {
        path: 'universities/:universityId/flows/:flowId/groups/:groupId/students',
        element: <AdminEntityPageWrapper entityType="students" />,
      },
      {
        path: 'universities/:universityId/teachers',
        element: <AdminEntityPageWrapper entityType="teachers" />,
      },
      {
        path: 'stagesEducation',
        element: <AdminEntityPageWrapper entityType="stagesEducation" />,
      },
      {
        path: 'profiles',
        element: <AdminEntityPageWrapper entityType="profiles" />,
      },
      {
        path: 'specializations',
        element: <AdminEntityPageWrapper entityType="specializations" />,
      },
      {
        path: 'markStrategies',
        element: <AdminEntityPageWrapper entityType="markStrategies" />,
      },
      {
        path: 'studentRoles',
        element: <AdminEntityPageWrapper entityType="studentRoles" />,
      },
      {
        path: 'criterias',
        element: <AdminEntityPageWrapper entityType="criterias" />,
      },
      {
        path: 'buildings',
        element: <AdminEntityPageWrapper key={'upd'} entityType="buildings" />,
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
        path: 'educationRequests',
        element: <EducationRequestsPage />,
      },
      {
        path: 'teacher-marks',
        element: <TeacherIntensiveMarksPage />,
      },
      {
        path: 'manager-marks',
        element: <ManagerIntensiveMarksPage />,
      },
      {
        path: 'results',
        element: <IntensiveAnswerPage />,
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
