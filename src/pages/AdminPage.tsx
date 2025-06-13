import { FC } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setIsSidebarOpen } from '../redux/slices/windowSlice';
import { useWindowSize } from '../helpers/useWindowSize';

import Sidebar from '../components/sidebar/Sidebar';
import AdminSidebarContent from '../components/sidebar/AdminSidebarContent';

const AdminPage: FC = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();

  const { width: windowWidth } = useWindowSize();

  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.window.isSidebarOpen);

  // Проверка на положительное число
  const idRegex = /^\d+$/;

  if (universityId && !idRegex.test(universityId || '')) {
    navigate('/*');
  }

  return (
    <>
      <div className="pt-[74px] h-screen grid grid-cols-1 md:grid-cols-[auto,1fr]">
        <Sidebar>
          <AdminSidebarContent />
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
    </>
  );
};

export default AdminPage;
