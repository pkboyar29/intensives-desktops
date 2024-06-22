import { Task } from '../../utils/types/Task'


export default function StudentTaskElem(props: Task) {

    return(
    <div className="flex justify-between items-center">
        <div className='flex space-x-4'>
            <img src='https://via.placeholder.com/50'/>
            <div className="flex flex-col space-y-2">
                <p className="font-semibold text-xl">{props.name}</p>
                <p>{props.desc}</p>
            </div>
        </div>
        <p>{props.finish_dt.toLocaleDateString()}</p>
    </div>
    )
}