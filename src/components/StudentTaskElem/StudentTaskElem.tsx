import './StudentTaskElem.css'
import { Task } from '../../utils/types/Task'


export default function StudentTaskElem(props: Task) {

    return(
    <div className="student-task-elem">
        <div className="info">
            <span className="name">{props.name}</span>
            <span>{props.desc}</span>
        </div>
        <span>{props.finish_dt.toLocaleDateString()}</span>
    </div>
    )
}