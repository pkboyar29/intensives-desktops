import React, { useState, useEffect, useRef } from 'react';
import {
  useLazyGetTasksColumnQuery,
  useCreateTaskMutation
} from '../redux/api/taskApi';
import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import KanbanColumnMenu from './KanbanColumnMenu';
import KanbanTask from './KanbanTask';
import { validateKanban } from '../helpers/kanbanHelpers';
import { useAppSelector } from '../redux/store';


interface KanbanColumnProps {
  id: number;
  index: number;
  title: string;
  colorHEX: string;
  moveColumn: (columnId: number, dragIndex: number, hoverIndex: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  onDeleteColumn: (id: number) => void;
}

const KanbanColumn: FC<KanbanColumnProps> = ({
  id,
  index,
  title,
  colorHEX,
  moveColumn,
  onUpdateTitle,
  onDeleteColumn
}) => {
  const [getTasks, { isLoading, isError }] = useLazyGetTasksColumnQuery();
  const [createTaskAPI] = useCreateTaskMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [creatingTask, setCreatingTask] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea создание задачи

  useEffect(() => {
    getTasks(id);
  }, [id, getTasks]);

  // Получаем колонку по её ID
  const column = useAppSelector((state) =>
    state.kanban.columns?.find((col) => col.id === id)
  );

  // Получаем задачи для этой колонки
  const tasks = useAppSelector((state) =>
    column?.taskIds.map((taskId) => state.kanban.tasks?.[taskId])
  );

  useEffect(() => {
    //console.log(tasks)
  }, [tasks]);

   // Функция для автоматического изменения высоты
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Сбрасываем высоту
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [creatingTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    //валидация названия колонки
    if (currentTitle !== title && validateKanban(currentTitle)) {
      onUpdateTitle(id, currentTitle); // Вызываем функцию обновления названия на беке
      title = currentTitle;
    }
    else{
      setCurrentTitle(title)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  // Прекращаем drag, если поле ввода активно
  const preventDrag = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
    }
  };

  const handleBlurTask = async () => {
    //валидация названия задачи
    if (creatingTask && validateKanban(creatingTask)) {
      createTask();
    }

    setCreatingTask(null);
  };

  const handleKeyDownTask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlurTask();
    }
  };

  const createTask = async () => {

    try{
      if(creatingTask) {
        await createTaskAPI({
          name: creatingTask,
          column: id,
        }).unwrap();
    }
    } catch(err) {
      console.error("Error on crating task:", err);
    }
  }

  const renameColumn = () => {
    setIsEditing(true); // Включаем режим редактирования
  };

  const deleteColumn = () => {
    onDeleteColumn(id)
  };

  // Используем DnD hook для перемещения колонки
  const [{ isDragging }, dragRef] = useDrag({
    type: 'COLUMN',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'COLUMN',
    hover: (item: { id:number, index: number }) => {
      if (item.index !== index) {
        moveColumn(item.id, item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={`w-80 p-4 bg-white rounded-lg shadow-md border-t-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ borderTopColor: colorHEX }}
      onMouseDown={preventDrag}
    >
      <div className="flex flex-row items-start justify-between">
        <div className="flex items-center justify-between mb-2 group">
          {isEditing ? (
            <input
              type="text"
              value={currentTitle}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              maxLength={500}
              placeholder="Введите название колонки..."
              autoFocus
              className="w-full text-xl font-semibold text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 "
            />
          ) : (
            <h2
              className="text-xl font-semibold text-gray-700 cursor-pointer"
              onDoubleClick={renameColumn}
            >
              {currentTitle}
            </h2>
          )}
        </div>

        <KanbanColumnMenu onRename={renameColumn} onDelete={deleteColumn} />
      </div>


      {creatingTask ? (
        <textarea
          ref={textareaRef}
          defaultValue={' '}
          onBlur={handleBlurTask}
          onKeyDown={handleKeyDownTask}
          onChange={(e) => setCreatingTask(e.target.value)}
          maxLength={500}
          placeholder="Введите название задачи..."
          autoFocus
          className="flex items-center overflow-hidden text-left align-top resize-none justify-between p-3 mb-3 transition border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:shadow-md w-[100%]"
        />
      ): <button className="w-full text-left text-blue hover:text-dark_blue" onClick={() => setCreatingTask(" ")}>
          + Создать задачу
        </button>}

      <div className="mt-4 space-y-2">
        {tasks && tasks.map((task) => (
          task && (
            <div>
              <KanbanTask
                key={task.id}
                id={task.id}
                name={task.name}
                isCompleted={task.isCompleted}
              />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
