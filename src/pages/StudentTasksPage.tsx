import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentTaskElem from '../components/StudentTaskElem';
import Title from '../components/common/Title';

const StudentTasksPage: FC = () => {
  return (
    <div className="student-tasks-page">
      <Title text="Мои задачи" />
      <div className="flex flex-col mt-5">
        <p className="">4 задачи, 2 в процессе</p>
        <div className="mt-8">
          <p className="text-2xl font-bold">In progress</p>
          <div className="p-4 space-y-8 ">
            <StudentTaskElem
              name="Задача 1"
              desc="описание задачи"
              finish_dt={new Date('2024-07-01')}
            />
            <StudentTaskElem
              name="Задача 2"
              desc="описание задачи"
              finish_dt={new Date('2024-07-01')}
            />
          </div>
        </div>
        <div className="mt-8">
          <p className="text-2xl font-bold">To Do</p>
          <div className="p-4 space-y-8 ">
            <StudentTaskElem
              name="Задача 1"
              desc="описание задачи"
              finish_dt={new Date('2024-07-01')}
            />
            <StudentTaskElem
              name="Задача 2"
              desc="описание задачи"
              finish_dt={new Date('2024-07-01')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTasksPage;
