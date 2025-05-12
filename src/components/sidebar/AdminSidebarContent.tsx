import { FC } from 'react';
import SidebarLink from './SidebarLink';

const AdminSidebarContent: FC = () => {
  return (
    <>
      <div className="text-xl font-bold text-black_2">{'Админ-панель'}</div>
      <div className="flex flex-col gap-4 my-3">
        <SidebarLink to="universities" text="Университеты" />
        <SidebarLink to="stagesEducation" text="Ступени" />
        <SidebarLink to="profiles" text="Профили" />
        <SidebarLink to="specializations" text="Направления" />
        <SidebarLink to="markStrategies" text="Шкалы" />
        <SidebarLink to="studentRoles" text="Роли студента" />
        <SidebarLink to="criterias" text="Критерии" />
      </div>
    </>
  );
};

export default AdminSidebarContent;
