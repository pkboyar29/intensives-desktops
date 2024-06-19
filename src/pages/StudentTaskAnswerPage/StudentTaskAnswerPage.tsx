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
            <div className='flex flex-col mt-2 space-y-3'>
                <input type="text" className='w-96 border border-black p-2' placeholder='Оставьте комментарий к выполнению'/>
                <PrimaryButton onClick={sendTask} text='Отправить'/>
            </div>
        </div>
    </div>
    )
}


export default StudentTaskAnswerPage