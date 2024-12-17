import { FC } from 'react';

interface KanbanTaskProps {
    id: string;
    title: string;
    isCompleted: boolean;
    assignee?: string;
    subtasksCount?: number;
    deadlineStart?: string;
    deadlineEnd?: string;
    onClick?: () => void;
    onClickComplete?: () => void;
}

const KanbanTask: FC<KanbanTaskProps> = ({ id, title, isCompleted, assignee, subtasksCount, deadlineStart, deadlineEnd, onClick }) => {

    return(
        <div
        className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-3 mb-3 flex justify-between items-center hover:shadow-md transition cursor-pointer"
        onClick={onClick}>
            {/* Левая часть с чекбоксом и названием */}
            <div className="flex items-down space-x-2 ml">
                <input type="checkbox" className="w-4 h-4 text-blue-500" />
                <div>
                <p className="text-gray-700 font-medium text-sm">{title}</p>
                <span className="inline-block bg-gray text-gray-600 text-xs px-2 py-1 rounded mt-2">
                    {id}
                </span>
                </div>
            </div>

            {/* Правая часть (иконка или инициалы) */}
            <div>
                {assignee ? (
                <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">
                    {assignee}
                </div>
                ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <span className="material-icons text-sm">person</span>
                </div>
                )}
            </div>
        </div>       
    )
}

export default KanbanTask;