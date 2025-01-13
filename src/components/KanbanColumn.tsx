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
  tasksCount: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  dropColumn: (columnId: number, newIndex: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  onUpdateColor: (id: number, newColorHEX: string) => void;
  onDeleteColumn: (id: number) => void;
}

const KanbanColumn: FC<KanbanColumnProps> = ({
  id,
  index,
  title,
  colorHEX,
  tasksCount,
  moveColumn,
  dropColumn,
  onUpdateTitle,
  onUpdateColor,
  onDeleteColumn
}) => {
  const [getTasks, { isLoading, isError }] = useLazyGetTasksColumnQuery();
  const [createTaskAPI] = useCreateTaskMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [creatingTask, setCreatingTask] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea создание задачи

  const [page, setPage] = useState(1); // Текущая страница
  const pageSize = 100; // Размер страницы
  const hasMore = useRef(true); // Есть ли ещё страницы для загрузки

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await getTasks({ column: id, page: 1, pageSize});

      if (data?.next === null) {
        hasMore.current = false; // Если `next` равно null, страниц больше нет
      } else {
        setPage(page + 1)
      }
    };

    fetchTasks();
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

  // Функция для автоматического изменения высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Сбрасываем высоту
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [creatingTask]);

  // Загрузка следующей страницы
  const loadMoreTasks = async () => {
    if (!hasMore.current || isLoading) return; // Не загружаем, если нет данных или уже идёт загрузка

    console.log("current page column ", page)
    const { data } = await getTasks({ column: id, page: page, pageSize });

    if (data?.next === null) {
      hasMore.current = false; // Если `next` равно null, страниц больше нет
    } else {
      setPage(page + 1)
    }
  };

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
      e.preventDefault(); // Предотвращает добавление переноса строки
      createTask();
      setCreatingTask('');
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
  const [{ isDragging }, dragRef, previewRef] = useDrag({
    type: 'COLUMN',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'COLUMN',
    hover: (item: { index: number, id: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index); // Вызываем локальное обновление при перетаскивании
        item.index = index;
      }
    },
    drop: (item: { index: number; id: number }) => {
      dropColumn(item.id, index); // Вызываем обновление позиций на сервере
    }
  });

  // Соединяем previewRef и dropRef
  const combinedRef = (node: HTMLDivElement | null) => {
    previewRef(node); // Отвечает за то как визуально выглядит перетаскиваемый объект
    dropRef(node);
  };

  return (
    <div
      ref={combinedRef} // Drop target и preview на всю колонку
      className={`w-100 bg-white rounded-lg shadow-md border-t-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ borderTopColor: colorHEX }}
    >
      <div
        ref={dragRef}
        onMouseDown={preventDrag}
        className='p-4'>
        
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
              <div className='flex flex-row items-center'>
                <h2
                  className="text-xl font-semibold text-gray-700 cursor-pointer"
                  onDoubleClick={renameColumn}>
                  {currentTitle}
                </h2>

                <div className='text-sm ml-2 bg-gray rounded-full mt-1' title="Количество задач в колонке">
                  <p>{tasksCount}</p>
                </div>
              </div>
            )}
          </div>

          <KanbanColumnMenu onRename={renameColumn} onChangeColor={(color: string) => onUpdateColor(id, color)} onDelete={deleteColumn} />
        </div>


        {creatingTask != null ? (
          <textarea
            ref={textareaRef}
            value={creatingTask}
            onBlur={handleBlurTask}
            onKeyDown={handleKeyDownTask}
            onChange={(e) => setCreatingTask(e.target.value)}
            maxLength={500}
            placeholder="Введите название задачи..."
            autoFocus
            className="flex items-center overflow-hidden text-left align-top resize-none justify-between p-3 mb-3 transition border border-gray-200 rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:shadow-md w-[100%]"
          />
        ): <button className="text-left text-blue hover:text-dark_blue" onClick={() => setCreatingTask("")}>
            + Создать задачу
          </button>}

        </div>

        <div className="space-y-2 max-h-[calc(100vh-200px)] ml-4 mr-4 md-4 mt-2 overflow-y-auto overflow-x-hidden">
          {tasks && tasks.map((task, index) => (
            task && (
              <div key={task.id}> {/* Добавляем key сюда так хочет реакт*/}
                <KanbanTask
                  id={task.id}
                  index={index}
                  columnId={id}
                  parentTaskId={null}
                  name={task.name}
                  isCompleted={task.isCompleted}
                  initialSubtaskCount={task.initialSubtaskCount}
                />
              </div>
            )
          ))}

          {hasMore.current && (
            <button className='w-full p-3 bg-blue text-white rounded-[10px] duration-300' onClick={loadMoreTasks}>Загрузить еще</button>
          )}
        </div>
    </div>
  );
};

export default KanbanColumn;
