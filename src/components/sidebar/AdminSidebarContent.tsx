import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store';
import { setIsSidebarOpen } from '../../redux/slices/windowSlice';
import { useWindowSize } from '../../helpers/useWindowSize';

import SidebarLink from './SidebarLink';

const AdminSidebarContent: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (windowWidth < 768) {
      dispatch(setIsSidebarOpen(false));
    }
  }, [pathname]);

  return (
    <>
      <div className="text-xl font-bold text-black_2">{'Админ-панель'}</div>
      <div className="flex flex-col gap-4 my-3">
        <SidebarLink to="universities" text="Университеты" />
        <SidebarLink to="stagesEducation" text="Ступени" />
        <SidebarLink to="profiles" text="Профили" />
        <SidebarLink to="specializations" text="Направления" />
        <SidebarLink to="buildings" text="Корпуса" />
      </div>
    </>
  );
};

export default AdminSidebarContent;
