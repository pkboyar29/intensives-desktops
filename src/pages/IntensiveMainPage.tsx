import { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  isUserMentor,
  isUserStudent,
  isUserTeacher,
} from '../helpers/userHelpers';

import { useGetIntensiveQuery } from '../redux/api/intensiveApi';
import { useAppSelector } from '../redux/store';

import IntensiveNotFoundComponent from '../components/IntensiveNotFoundComponent';
import Sidebar from '../components/sidebar/Sidebar';
import ManagerSidebarContent from '../components/sidebar/ManagerSidebarContent';
import TeacherSidebarContent from '../components/sidebar/TeacherSidebarContent';
import StudentSidebarContent from '../components/sidebar/StudentSidebarContent';

const IntensiveMainPage: FC = () => {
  const params = useParams();

  const { isLoading, isError } = useGetIntensiveQuery(
    Number(params.intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const currentUser = useAppSelector((state) => state.user.data);

  return (
    <>
      {isError ? (
        <IntensiveNotFoundComponent />
      ) : (
        <div className="pt-[74px] h-screen grid grid-cols-[auto,1fr]">
          <Sidebar>
            {isUserStudent(currentUser) || isUserMentor(currentUser) ? (
              <StudentSidebarContent isIntensiveLoading={isLoading} />
            ) : isUserTeacher(currentUser) ? (
              <TeacherSidebarContent isIntensiveLoading={isLoading} />
            ) : (
              <ManagerSidebarContent isIntensiveLoading={isLoading} />
            )}
          </Sidebar>
          <div className="w-full md:pl-10 pl-[90px] pr-10 pt-5 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default IntensiveMainPage;
