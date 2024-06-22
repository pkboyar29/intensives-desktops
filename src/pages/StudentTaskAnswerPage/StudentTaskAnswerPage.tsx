import { FC, useState, useEffect } from 'react'
import Title from '../../components/Title/Title';
import { Task } from '../../utils/types/Task'
import { useParams } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';

const StudentTaskAnswerPage: FC = () => {
    const { taskId } = useParams();
    const [taskInfo, setTaskInfo] = useState<Task>();

    useEffect(() => {
        loadTaskInfo();

    }, []);

    function loadTaskInfo() {
        console.log(taskId);
        const data: Task = {
            name: "Название задачи",
            desc: "Описание задачи",
            finish_dt: new Date('2024-07-01')
        }

        setTaskInfo(data)
    }

    function sendTask() {
        console.log("task send");
    }

    if(!setTaskInfo) {
        return(<></>)
    }

    return(
    <div className=''>
        <div className='flex flex-col space-y-5'>
            {taskInfo?.name && <Title text={taskInfo.name} />}
            {taskInfo?.desc && <p>{taskInfo.desc}</p>}
        </div>
        <div className='mt-8'>
            <p className='font-bold text-xl'>Выполнение</p>
            <div className='mb-5 mt-5'>
                <textarea id="textarea" rows={10} className='w-full h-32 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-md' placeholder='Оставьте комментарий к выполнению'/>
            </div>
            <div className='flex flex-col items-end w-[100%] mt-5'>
                <PrimaryButton onClick={sendTask} text='Отправить'/>
            </div>
        </div>
    </div>
    )
}


export default StudentTaskAnswerPage