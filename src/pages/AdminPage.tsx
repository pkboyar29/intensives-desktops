import { FC, useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import AdminSidebarContent from '../components/sidebar/AdminSidebarContent';
import { Outlet } from 'react-router-dom';

const AdminPage: FC = () => {
  return (
    <>
      <div className="pt-[74px] h-screen grid grid-cols-[auto,1fr]">
        <Sidebar>
          <AdminSidebarContent />
        </Sidebar>

        <div className="w-full px-10 pt-5 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
