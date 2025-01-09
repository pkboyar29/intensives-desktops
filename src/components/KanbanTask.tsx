import { FC, useState, useEffect, useRef } from 'react';
import KanbanTaskMenu from './KanbanTaskMenu';
import {
  useCreateTaskMutation,
  useDeleteTaskMutation
} from '../redux/api/taskApi';
import { validateKanban } from '../helpers/kanbanHelpers';


interface KanbanTaskProps {
  id: number;
  name: string;
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
  name,
  isCompleted,
  assignee,
  subtasksCount,
  deadlineStart,
  deadlineEnd,
  onClick,
}) => {
  const [createTaskAPI] = useCreateTaskMutation();
  const [deleteTaskAPI] = useDeleteTaskMutation();

  const [creatingSubtask, setCreatingSubtask] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea создание подзадачи


  // Функция для автоматического изменения высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Сбрасываем высоту
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [creatingSubtask]);

  const renameTask = () => {
    
  };

  const handleBlurTask = async () => {
      //валидация названия задачи
      if (creatingSubtask && validateKanban(creatingSubtask)) {
        createSubtask();
      }
  
      setCreatingSubtask(null);
  };
  
    const handleKeyDownTask = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Предотвращает добавление переноса строки
        createSubtask();
        setCreatingSubtask('');
      }
  };

  const createSubtask = async () => {
    try{
      if(creatingSubtask) {
        await createTaskAPI({
          name: creatingSubtask,
          parentTask: id
        }).unwrap();
      }
    } catch(err) {
      console.error("Error on crating task:", err);
    }
  }

  const deleteTask = async () => {
    try{
      await deleteTaskAPI(id).unwrap();
      
    } catch(error) {
      console.error("Error on deleting task:", error);
    }
  };


  return (
    <div
      className="flex flex-col p-3 mb-3 transition border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:shadow-md"
      onClick={onClick}
    >
      <div className='flex flex-row justify-between items-center'>
        {/* Левая часть с чекбоксом и названием */}
        <div className="flex space-x-2 items-down ml">
          <input type="checkbox" className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">{name}</p>
            <span className="inline-block px-2 py-1 mt-2 text-xs text-gray-600 rounded bg-gray">
              {id}
            </span>
          </div>
        </div>

        {/* Правая часть (иконка или инициалы) */}
        <div>
          <KanbanTaskMenu onRename={renameTask} onCreateSubtask={() => setCreatingSubtask(' ')} onDelete={deleteTask} />
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

      {/* Область с подзадачами */}
      <div className=''>
        {creatingSubtask != null ? (
          <textarea
            ref={textareaRef}
            value={creatingSubtask}
            onBlur={handleBlurTask}
            onKeyDown={handleKeyDownTask}
            onChange={(e) => setCreatingSubtask(e.target.value)}
            maxLength={500}
            placeholder="Введите название задачи..."
            autoFocus
            className="flex items-center overflow-hidden text-left align-top resize-none justify-between p-3 mb-3 transition border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:shadow-md w-[100%]"
          />
          ):(<></>)}
      </div>
    </div>
  );
};

export default KanbanTask;
