import { FC, useEffect, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { CurrentUserContext } from '../context/CurrentUserContext';

import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import Header from '../components/Header/Header';
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
import Intensives from '../pages/Intensives';
import ManageMenu from '../pages/ManageMenu';
import CreateCommand from '../pages/CreateCommand';
import ListCreateIntensiv from '../components/ListCreateIntensiv';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const App: FC = () => {
  const { updateCurrentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    updateCurrentUser();
  }, []);

  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/teacher/:intensiveId" element={<TeacherMainPage />}>
          <Route path="overview" element={<IntensiveOverviewPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:eventId" element={<EventOverviewPage />} />
          <Route
            path="team-evaluation/:eventId/:teamId"
            element={<TeamEvaluationPage />}
          />
          {/* <Route path='education-requests' element={<EducationRequestsPage />} />
          <Route path='education-requests/:requestId' element={<EducationRequestOverviewPage />} /> */}
        </Route>

        <Route path="/student/:teamId" element={<StudentMainPage />}>
          <Route path="overview" element={<TeamOverviewPage />} />
          <Route path="intensiv-overview" element={<IntensiveOverviewPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:eventId" element={<EventOverviewPage />} />
          <Route path="tasks-board" element={<StudentTasksBoardPage />} />
          <Route path="tasks" element={<StudentTasksPage />} />
          <Route path="task/:taskId" element={<StudentTaskAnswerPage />} />
        </Route>

        <Route path="/evaluation" element={<EvaluationIntensivePage />} />
        <Route path="/intensives1" element={<IntensivesPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/" element={<Navigate to="/sign-in" />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route path="/intensives" element={<Intensives />} />
        <Route path="/manageMenu" element={<ManageMenu />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/createIntensive" element={<ListCreateIntensiv />} />
        <Route path="/intensiv" element={<Intensiv />} />
        <Route path="/commands" element={<Commands />} />
        <Route
          path="/createCom"
          element={
            <DndProvider backend={HTML5Backend}>
              <CreateCommand />
            </DndProvider>
          }
        />
        <Route path="/editRoles" element={<ManageRoles />} />
        <Route path="/editProfile" element={<ManageProfile />} />
        <Route path="/editEvent" element={<CreateEvent />} />
        <Route path="/statisticsIntensive" element={<StatisticsIntensive />} />
      </Routes>
    </div>
  );
};

export default App;
