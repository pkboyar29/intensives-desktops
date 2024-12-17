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

const KanbanTask: FC<KanbanTaskProps> = ({
  id,
  title,
  isCompleted,
  assignee,
  subtasksCount,
  deadlineStart,
  deadlineEnd,
  onClick,
}) => {
  return (
    <div
      className="flex items-center justify-between p-3 mb-3 transition border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:shadow-md"
      onClick={onClick}
    >
      {/* Левая часть с чекбоксом и названием */}
      <div className="flex space-x-2 items-down ml">
        <input type="checkbox" className="w-4 h-4 text-blue-500" />
        <div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <span className="inline-block px-2 py-1 mt-2 text-xs text-gray-600 rounded bg-gray">
            {id}
          </span>
        </div>
      </div>

      {/* Правая часть (иконка или инициалы) */}
      <div>
        {assignee ? (
          <div className="flex items-center justify-center text-xs font-semibold text-white bg-blue-500 rounded-full w-7 h-7">
            {assignee}
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-500 bg-gray-200 rounded-full w-7 h-7">
            <span className="text-sm material-icons">person</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanTask;
