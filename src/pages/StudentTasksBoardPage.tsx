import ProfilePicture from '../components/ProfilePicture/ProfilePicture';
import { FC } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { TaskTableRow } from '../utils/types/Task';
import Title from '../components/Title';
import Table from '../components/Table';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigate, useParams } from 'react-router-dom';
import TasksTab from '../components/TasksTab/TasksTab';

const StudentTasksBoardPage: FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const intensives: TaskTableRow[] = [
    {
      name: 'Задача 1',
      assignee: 0,
      finish_dt: new Date('2024-07-01'),
      status: 'To Do',
    },
  ];
  const columnHelper = createColumnHelper<TaskTableRow>();
  const columns = [
    columnHelper.accessor('name', {
      header: () => 'Название',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignee', {
      header: () => 'Ответственные',
      cell: (info) => <ProfilePicture size={45} />, //скорее всего надо отдельный компонент куда передается number[] и там запрос для получения аватарок для каждого id и адаптивное отображение
    }),
    columnHelper.accessor('finish_dt', {
      header: () => 'Срок сдачи',
      cell: (info) => info.getValue().toLocaleDateString(),
    }),
    columnHelper.accessor('status', {
      header: () => 'Статус',
      cell: (info) => info.getValue(),
    }),
  ];

  function clickAddTask() {
    console.log('добавление задачи');
  }

  function handleTab(tabId: number) {
    console.log('Tab ' + tabId);
  }

  return (
    <div className="student-tasks-page">
      <div className="container">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <Title text="Доска задач" />
            <PrimaryButton text="Добавить задачу" onClick={clickAddTask} />
          </div>
          <TasksTab onTabChange={handleTab} />
          <Table
            onClick={(id: number) => navigate(`/tasks/${id}/`)}
            columns={columns}
            data={intensives}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentTasksBoardPage;
