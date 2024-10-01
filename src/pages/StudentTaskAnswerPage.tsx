import { FC, useState, useEffect } from 'react';
import Title from '../components/Title';
import { ITask } from '../ts/interfaces/ITask';
import { useParams } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';

const StudentTaskAnswerPage: FC = () => {
  const { taskId } = useParams();
  const [taskInfo, setTaskInfo] = useState<ITask>();

  useEffect(() => {
    loadTaskInfo();
  }, []);

  function loadTaskInfo() {
    console.log(taskId);
    const data: ITask = {
      name: 'Название задачи',
      desc: 'Описание задачи',
      finish_dt: new Date('2024-07-01'),
    };

    setTaskInfo(data);
  }

  function sendTask() {
    console.log('task send');
  }

  if (!setTaskInfo) {
    return <></>;
  }

  return (
    <div className="">
      <div className="flex flex-col space-y-5">
        {taskInfo?.name && <Title text={taskInfo.name} />}
        {taskInfo?.desc && <p>{taskInfo.desc}</p>}
      </div>
      <div className="mt-8">
        <p className="text-xl font-bold">Выполнение</p>
        <div className="mt-5 mb-5">
          <textarea
            id="textarea"
            rows={10}
            className="w-full h-32 p-4 border border-gray-300 rounded shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Оставьте комментарий к выполнению"
          />
        </div>
        <div className="flex flex-col items-end w-[100%] mt-5">
          <PrimaryButton clickHandler={sendTask} text="Отправить" />
        </div>
      </div>
    </div>
  );
};

export default StudentTaskAnswerPage;
