import { RouteObject, Navigate } from 'react-router-dom';
import { UserRoleKey } from '../ts/interfaces/IUser';

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
import QuestionsPage from '../pages/QuestionsPage';
import TestsPage from '../pages/TestsPage';
import CreateTestPage from '../pages/CreateTestPage';
import EditTestPage from '../pages/EditTestPage'; // Импортируются страницы и компоненты, которые будут использоваться в маршрутах
import InteniveTests from '../pages/IntensiveTests'; // Импортируется страница с тестами для интенсива
import EducationRequestsPage from '../pages/EducationRequestsPage';
import AdminPage from '../pages/AdminPage';
import AdminEntityPage from '../pages/AdminEntityPage';
import { TableType } from '../tableConfigs';
import IntensiveAnswerPage from '../pages/IntensiveAnswerPage';

export type RouteType = RouteObject & {
  resolvedRoles: UserRoleKey[];
  children?: RouteType[];
};

const AdminEntityPageWrapper = ({ entityType }: { entityType: TableType }) => {
  return <AdminEntityPage key={entityType} entityType={entityType} />;
};

const routeConfig: RouteType[] = [
  {
    path: '/admin',
    element: <AdminPage />,
    resolvedRoles: ['Admin'],
    children: [
      // можно все сделать одной функцией по последнему слову в url ?
      {
        path: '',
        element: <Navigate to="universities" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'universities',
        element: <AdminEntityPageWrapper entityType="universities" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'users',
        element: <AdminEntityPageWrapper entityType="buildings" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'universities/:universityId/buildings',
        element: <AdminEntityPageWrapper entityType="buildings" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'universities/:universityId/buildings/:buildingId/audiences',
        element: <AdminEntityPageWrapper entityType="audiences" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'universities/:universityId/flows',
        element: <AdminEntityPageWrapper entityType="flows" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'universities/:universityId/flows/:flowId/groups',
        element: <AdminEntityPageWrapper entityType="groups" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'universities/:universityId/flows/:flowId/groups/:groupId/students',
        element: <AdminEntityPageWrapper entityType="students" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'universities/:universityId/teachers',
        element: <AdminEntityPageWrapper entityType="teachers" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'stagesEducation',
        element: <AdminEntityPageWrapper entityType="stagesEducation" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'profiles',
        element: <AdminEntityPageWrapper entityType="profiles" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'specializations',
        element: <AdminEntityPageWrapper entityType="specializations" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'markStrategies',
        element: <AdminEntityPageWrapper entityType="markStrategies" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'studentRoles',
        element: <AdminEntityPageWrapper entityType="studentRoles" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'criterias',
        element: <AdminEntityPageWrapper entityType="criterias" />,
        resolvedRoles: ['Admin'],
      },
      {
        path: 'buildings',
        element: <AdminEntityPageWrapper entityType="buildings" />,
        resolvedRoles: ['Admin'],
      },
    ],
  },
  {
    path: '/intensives',
    element: <IntensivesPage />,
    resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
  },
  {
    path: '/questions',
    element: <QuestionsPage />,
    requiredAuth: false,
  },
  {
    path: '/intensives/:intensiveId',
    element: <IntensiveMainPage />,
    resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
    children: [
      {
        path: '',
        element: <Navigate to="overview" />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'overview',
        element: <IntensiveOverviewPage />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'teams',
        element: <TeamsPage />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'schedule/:eventId',
        element: <EventPage />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'team-overview',
        element: <TeamOverviewPage />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'kanban',
        element: <KanbanBoardPage />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'editIntensive',
        element: <ManageIntensiveForm />,
        resolvedRoles: ['Manager'],
      },
      {
        path: 'createTeams',
        element: <CreateTeamsPage />,
        resolvedRoles: ['Manager'],
      },
      {
        path: 'createSupportTeams',
        element: <CreateSupportTeamsPage />,
        resolvedRoles: ['Manager'],
      },
      {
        path: 'schedule/editEvent',
        element: <ManageEventForm />,
        resolvedRoles: ['Manager'],
      },
      {
        path: 'educationRequests',
        element: <EducationRequestsPage />,
        resolvedRoles: ['Student', 'Mentor', 'Teacher', 'Manager'],
      },
      {
        path: 'teacher-marks',
        element: <TeacherIntensiveMarksPage />,
        resolvedRoles: ['Teacher'],
      },
      {
        path: 'manager-marks',
        element: <ManagerIntensiveMarksPage />,
        resolvedRoles: ['Manager'],
      },
      {
        path: 'results',
        element: <IntensiveAnswerPage />,
        resolvedRoles: ['Student'],
      },
      {
        path: 'statistics',
        element: <IntensiveStatisticsPage />,
        resolvedRoles: ['Manager'],
      },
      {
        path: 'tests',
        element: <InteniveTests/>
      }
    ],
  },
  {
    path: '/createIntensive',
    element: <ManageIntensiveForm />,
    resolvedRoles: ['Manager'],
  },
  {
    path: '/tests',
    element: <TestsPage />,
    resolvedRoles: ['Manager'],
  },
  {
    path: '/createTestPage',
    element: <CreateTestPage/>,
    resolvedRoles: ['Manager'],
  },
  {
    path: '/tests/:testId',
    element: <EditTestPage />,
    resolvedRoles: ['Manager'],
  },
  {
    path: '/',
    element: <Navigate to="/sign-in" />,
    resolvedRoles: ['Admin', 'Manager', 'Teacher', 'Student', 'Mentor'],
  },
  {
    path: '*',
    element: <NotFoundPage />,
    resolvedRoles: ['Admin', 'Manager', 'Teacher', 'Student', 'Mentor'],
  },
];

export default routeConfig;
