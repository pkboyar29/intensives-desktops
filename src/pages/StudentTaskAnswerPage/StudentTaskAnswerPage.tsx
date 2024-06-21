import { FC, useState, useEffect } from 'react'
import Title from '../../components/Title/Title';
import { Task } from '../../utils/types/Task'
import { useParams } from 'react-router-dom';

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

    if(!setTaskInfo) {
        return(<div></div>)
    }

    return(
    <div className='student-task-answer-page'>
        <div className='container'>
            {taskInfo?.name && <Title text={taskInfo.name} />}
            {taskInfo?.desc && <span>{taskInfo.desc}</span>}
        </div>
    </div>
    )
}


export default StudentTaskAnswerPage