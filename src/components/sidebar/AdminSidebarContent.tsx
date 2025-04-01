import { FC } from 'react';
import SidebarLink from './SidebarLink';

const AdminSidebarContent: FC = () => {
  return (
    <>
      <div className="text-xl font-bold text-black_2">{'Админ-панель'}</div>
      <div className="flex flex-col gap-4 my-3">
        <SidebarLink to="universities" text="Университеты" />
        <SidebarLink to="kanban" text="Education" />
        <SidebarLink to="kanban" text="Потоки и группы" />
        <SidebarLink to="users" text="Пользователи" />
      </div>
    </>
  );
};

export default AdminSidebarContent;
