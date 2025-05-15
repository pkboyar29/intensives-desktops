import { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  isUserMentor,
  isUserStudent,
  isUserTeacher,
} from '../helpers/userHelpers';
import { useWindowSize } from '../helpers/useWindowSize';

import { useGetIntensiveQuery } from '../redux/api/intensiveApi';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { setIsSidebarOpen } from '../redux/slices/windowSlice';

import IntensiveNotFoundComponent from '../components/IntensiveNotFoundComponent';
import Sidebar from '../components/sidebar/Sidebar';
import ManagerSidebarContent from '../components/sidebar/ManagerSidebarContent';
import TeacherSidebarContent from '../components/sidebar/TeacherSidebarContent';
import StudentSidebarContent from '../components/sidebar/StudentSidebarContent';

const IntensiveMainPage: FC = () => {
  const params = useParams();

  const { width: windowWidth } = useWindowSize();

  const { isLoading, isError } = useGetIntensiveQuery(
    Number(params.intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.data);
  const isSidebarOpen = useAppSelector((state) => state.window.isSidebarOpen);

  return (
    <>
      {isError ? (
        <IntensiveNotFoundComponent />
      ) : (
        <div className="pt-[74px] h-screen grid grid-cols-1 md:grid-cols-[auto,1fr]">
          <Sidebar>
            {isUserStudent(currentUser) || isUserMentor(currentUser) ? (
              <StudentSidebarContent isIntensiveLoading={isLoading} />
            ) : isUserTeacher(currentUser) ? (
              <TeacherSidebarContent isIntensiveLoading={isLoading} />
            ) : (
              <ManagerSidebarContent isIntensiveLoading={isLoading} />
            )}
          </Sidebar>
          <div
            className={`w-full px-5 py-5 overflow-y-auto md:px-10 ${
              isSidebarOpen && windowWidth < 768
                ? 'opacity-40 overflow-y-hidden transition duration-300 ease-in-out'
                : ''
            }`}
            onClick={() => {
              if (isSidebarOpen && windowWidth < 768) {
                dispatch(setIsSidebarOpen(false));
              }
            }}
          >
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default IntensiveMainPage;
