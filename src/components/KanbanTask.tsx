import { FC } from 'react';

interface KanbanTaskProps {
    id: string;
    title: string;
    isCompleted: boolean;
    subtasksCount: number;
    deadlineStart: string;
    deadlineEnd: string;
}

const KanbanTask: FC<KanbanTaskProps> = ({ title }) => {

    return(
        <div>
            
        </div>      
    )
}

export default KanbanTask;