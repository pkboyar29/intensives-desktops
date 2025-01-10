import { FC, useState, useEffect, useRef } from 'react';
import KanbanTaskMenu from './KanbanTaskMenu';
import {
  useLazyGetSubtasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation
} from '../redux/api/taskApi';
import { validateKanban } from '../helpers/kanbanHelpers';
import { useAppSelector } from '../redux/store';


interface KanbanTaskProps {
  id: number;
  name: string;
  isCompleted: boolean;
  assignee?: string;
  initialSubtaskCount?: number | null;
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
  initialSubtaskCount,
  deadlineStart,
  deadlineEnd,
  onClick,
}) => {
  const [getSubtasks, { isLoading, isError }] = useLazyGetSubtasksQuery();
  const [createTaskAPI] = useCreateTaskMutation();
  const [deleteTaskAPI] = useDeleteTaskMutation();

  const [isExpandedSubtasks, setIsExpandedSubtasks] = useState(false); // Состояние для раскрытия подзадач
  const [creatingSubtask, setCreatingSubtask] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea создание подзадачи


  // Функция для автоматического изменения высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Сбрасываем высоту
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [creatingSubtask]);

  // Получаем id подзадач
  const subtasks = useAppSelector((state) => state.kanban.subtasks?.[id] || []); // не нужен ??

  // Получаем данные подзадач
  const subtasksData = useAppSelector((state) =>
    (state.kanban.subtasks?.[id] || []).map((subtaskId) => state.kanban.tasks?.[subtaskId])
  );

  // Получаем количество подзадач
  const subtaskCount = useAppSelector((state) =>
    state.kanban.subtasks?.[id]?.length || 0
  );

  const renameTask = () => {
    console.log(subtaskCount)
    console.log(initialSubtaskCount)
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
      console.error("Error on crating subtask:", err);
    }
  }

  const deleteTask = async () => {
    try{
      await deleteTaskAPI(id).unwrap();
      
    } catch(error) {
      console.error(`Error on deleting subtask id=${id}`, error);
    }
  };

  const expandedSubtasks = async () => {
    if(!isExpandedSubtasks && subtaskCount === 0) {
       // Загружаем подзадачи, если они ещё не загружены
      await getSubtasks(id);
    }
    setIsExpandedSubtasks((prev) => !prev)
  }

  // Логика отображения количества подзадач
  const displayedSubtaskCount =
    (initialSubtaskCount !== null && initialSubtaskCount! > 0)
      ? initialSubtaskCount // Показываем изначальное значение
      : subtaskCount; // После подгрузки показываем актуальное значение


  return (
    <div
      className="flex flex-col mb-3 transition border border-gray-200 rounded-lg hover:shadow-md"
      onClick={onClick}
    >
      <div className='flex p-3 flex-row justify-between items-center bg-white rounded-lg cursor-pointer'>

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
          <KanbanTaskMenu onRename={renameTask} onCreateSubtask={() => { 
            setCreatingSubtask('');
            setIsExpandedSubtasks(true) }}
            onDelete={deleteTask} />
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
      <div className='flex flex-col bg-gray'>
        {displayedSubtaskCount ? (
          <div className='flex flex-row space-x-2 justify-end mt-1 mb-1 mr-1 cursor-pointer' onClick={expandedSubtasks}>
            <p className=''>{displayedSubtaskCount}</p>
            {isExpandedSubtasks ? <p>&#x25B2;</p> : <p>&#x25BC;</p>}
          </div>
          ):(<></>)}

        {creatingSubtask != null ? (
          <textarea
            ref={textareaRef}
            value={creatingSubtask}
            onBlur={handleBlurTask}
            onKeyDown={handleKeyDownTask}
            onChange={(e) => setCreatingSubtask(e.target.value)}
            maxLength={500}
            placeholder="Введите название подзадачи..."
            autoFocus
            className="flex items-center overflow-hidden text-left align-top resize-none justify-between p-3 mb-3 transition border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:shadow-md w-[100%]"
          />
          ) : (
            <button className="text-left text-blue hover:text-dark_blue" onClick={() => setCreatingSubtask("")}>
            
            </button>
          )}

          {isExpandedSubtasks && subtasksData.length > 0 && (
            <div>
              {subtasksData.map((subtask) => {
                if (!subtask) return null;
              
              return (
                <div key={subtask.id} className='ml-3 mr-1'>
                  <KanbanTask
                    id={subtask.id}
                    name={subtask.name}
                    isCompleted={subtask.isCompleted}
                    initialSubtaskCount={subtask.initialSubtaskCount}
                  />
                </div>
              );
              })}
            </div>
          )}
      </div>

    </div>
  );
};

export default KanbanTask;