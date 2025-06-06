import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  useLazyGetTasksColumnQuery,
  useCreateTaskMutation,
  useUpdateTaskPositionMutation,
} from '../redux/api/taskApi';
import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import KanbanColumnMenu from './KanbanColumnMenu';
import KanbanTask from './KanbanTask';
import { validateKanban } from '../helpers/kanbanHelpers';
import { useAppSelector, useAppDispatch } from '../redux/store';
import {
  moveTaskTemporary,
  savePreviousState,
  selectTasksByColumnId,
  setMovingPlaceholder,
} from '../redux/slices/kanbanSlice';
import Skeleton from 'react-loading-skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ITaskPositionUpdate } from '../ts/interfaces/ITask';
import {
  isUserMentor,
  isUserStudent,
  isUserTeamlead,
} from '../helpers/userHelpers';

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
  onDeleteColumn,
}) => {
  const dispatch = useAppDispatch();
  const [getTasks, { isLoading, isError, isSuccess }] =
    useLazyGetTasksColumnQuery();
  const [createTaskAPI] = useCreateTaskMutation();
  const [updateTaskPositionAPI] = useUpdateTaskPositionMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [creatingTask, setCreatingTask] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea создание задачи

  const [page, setPage] = useState(1); // Текущая страница
  const pageSize = 100; // Размер страницы
  const hasMore = useRef(false); // Есть ли ещё страницы для загрузки

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await getTasks({ column: id, page: 1, pageSize });

      if (data?.next === null) {
        hasMore.current = false; // Если `next` равно null, страниц больше нет
      } else {
        hasMore.current = true;
        setPage(page + 1);
      }
    };

    fetchTasks();
  }, [id, getTasks]);

  // Получаем колонку по её ID
  //const column = useAppSelector((state) =>
  // state.kanban.columns?.find((col) => col.id === id)
  //);

  // Получаем задачи для этой колонки
  //const selectTasks = useMemo(() => selectTasksByColumnId(id), [id]); // проверить если убрать
  const tasks = useAppSelector((state) =>
    isSuccess ? selectTasksByColumnId(id)(state) : null
  );
  const dndPlaceholder = useAppSelector(
    (state) => state.kanban.dndTaskPlaceholderIndex
  );

  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  useEffect(() => {
    //console.log('rerender column id -', id);
    //console.log('задачи колонки id', id, '-', tasks);
  }, [tasks]);

  // Функция для автоматического изменения высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Сбрасываем высоту
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [creatingTask]);

  // Загрузка следующей страницы
  const loadMoreTasks = async () => {
    if (!hasMore.current || isLoading) return; // Не загружаем, если нет данных или уже идёт загрузка

    console.log('current page column ', page);
    const { data } = await getTasks({ column: id, page: page, pageSize });

    if (data?.next === null) {
      hasMore.current = false; // Если `next` равно null, страниц больше нет
    } else {
      setPage(page + 1);
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
    } else {
      setCurrentTitle(title);
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
    try {
      if (creatingTask) {
        await createTaskAPI({
          name: creatingTask,
          column: id,
        }).unwrap();
      }
    } catch (err) {
      console.error('Error on crating task:', err);
    }
  };

  const renameColumn = () => {
    setIsEditing(true); // Включаем режим редактирования
  };

  const deleteColumn = () => {
    onDeleteColumn(id);
  };

  const updateTaskPosition = async (payload: ITaskPositionUpdate) => {
    console.log(payload);
    try {
      await updateTaskPositionAPI(payload);
    } catch (err) {
      console.error('Error on updating position subtask:', err);
    }
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
    hover: (item: { index: number; id: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index); // Вызываем локальное обновление при перетаскивании
        item.index = index;
      }
    },
    drop: (item: { index: number; id: number }) => {
      dropColumn(item.id, index); // Вызываем обновление позиций на сервере
    },
  });

  const [, dropTaskRef] = useDrop({
    accept: 'TASK',
    hover: (item: {
      id: number;
      index: number;
      columnId: number | null;
      parentTaskId: number | null;
    }) => {},
    collect: (monitor) => {
      if (
        !monitor.isOver() &&
        dndPlaceholder &&
        dndPlaceholder?.hoverId !== null
      ) {
        //console.log('Вышли из зоны hover в column');
        /*
        dispatch(
          setMovingPlaceholder({
            draggableId: monitor.getItem().id,
            hoverId: null,
          })
        );
        */
      }
    },
    drop: (
      item: {
        id: number;
        index: number;
        columnId: number | null;
        parentTaskId: number | null;
      },
      monitor
    ) => {
      if (!dndPlaceholder) return;

      const hoverIndex = dndPlaceholder.hoverIndex;
      if (hoverIndex === null) return;
      //const toColumnId = dndPlaceholder.hoverColumnId;

      dispatch(
        setMovingPlaceholder({
          draggableId: null,
        })
      );
      // Если не сдвинули
      if (item.columnId === id && item.index === dndPlaceholder.hoverIndex)
        return;

      dispatch(savePreviousState());
      dispatch(
        moveTaskTemporary({
          taskId: item.id,
          dragIndex: item.index,
          hoverIndex: hoverIndex,
          fromColumnId: item.columnId,
          toColumnId: id,
          fromParentTaskId: item.parentTaskId,
          toParentTaskId: null,
        })
      );

      updateTaskPosition({
        id: item.id,
        position: hoverIndex,
        column: id,
      });
    },
  });

  // Соединяем previewRef и dropRef
  const previewRefDropRef = (node: HTMLDivElement | null) => {
    previewRef(node); // Отвечает за то как визуально выглядит перетаскиваемый объект
    dropRef(node);
  };

  /*
  const dragRefDropTaskRef = (node: HTMLDivElement | null) => {
    dragRef(node);
    dropTaskRef(node);
  };
  */
  const renderedTasks: JSX.Element[] = [];
  if (tasks) {
    var addIndex = false;
    //console.log(dndPlaceholder?.hoverIndex);
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      /*
      if (
        dndPlaceholder &&
        task.id === dndPlaceholder?.hoverId &&
        (i < dndPlaceholder?.draggableIndex! ||
          id !== dndPlaceholder?.draggableColumnId)
      ) {
        renderedTasks.push(
          <motion.div
            key={'placeholder-motion'}
            transition={{ duration: 0.14 }}
          >
            <div
              key={'placeholder'}
              ref={dropTaskRef}
              className={`border border-blue border-separate rounded-lg`}
              style={{
                width: dndPlaceholder.draggableWidth,
                height: dndPlaceholder.draggableHeight,
              }}
            />
          </motion.div>
        );
        addIndex = true;
      }
      */

      //if (task.id !== dndPlaceholder?.draggableId) {
      renderedTasks.push(
        <motion.div key={task.id} layout transition={{ duration: 0.14 }}>
          <KanbanTask
            id={task.id}
            index={addIndex ? i + 1 : i}
            columnId={id}
            parentTaskId={null}
            name={task.name}
            assignees={task.assignees ? task.assignees : undefined}
            isCompleted={task.isCompleted}
            initialSubtaskCount={task.initialSubtaskCount}
          />
        </motion.div>
      );
      //}

      /*
      if (
        dndPlaceholder &&
        task.id === dndPlaceholder?.hoverId &&
        i >= dndPlaceholder?.draggableIndex! &&
        id === dndPlaceholder.draggableColumnId
      ) {
        renderedTasks.push(
          <motion.div
            key={'placeholder-motion'}
            transition={{ duration: 0.14 }}
          >
            <div
              key={'placeholder'}
              ref={dropTaskRef}
              className={`border border-blue border-separate rounded-lg`}
              style={{
                width: dndPlaceholder.draggableWidth,
                height: dndPlaceholder.draggableHeight,
              }}
            />
          </motion.div>
        );
        addIndex = true;
      }
        */
    }
  }

  /*
  const renderedTasksReduce = tasks?.reduce<{
    elements: JSX.Element[];
    placeholderRendered: boolean;
  }>(
    (acc, task, i) => {
      if (
        task.id === dndPlaceholder?.hoverIndex &&
        id === dndPlaceholder?.hoverColumnId &&
        !acc.placeholderRendered
      ) {
        console.log(task);
        acc.elements.push(
          <div
            key={'placeholder'}
            ref={dropTaskRef}
            className={`border border-blue border-separate rounded-lg`}
            style={{
              width: dndPlaceholder.draggableWidth,
              height: dndPlaceholder.draggableHeight,
            }}
          />
        );
        acc.placeholderRendered = true;
      }

      if (task.id !== dndPlaceholder?.draggableId) {
        acc.elements.push(
          <KanbanTask
            id={task.id}
            index={i}
            columnId={id}
            parentTaskId={null}
            name={task.name}
            isCompleted={task.isCompleted}
            initialSubtaskCount={task.initialSubtaskCount}
          />
        );
      }
      return acc;
    },
    { elements: [], placeholderRendered: false }
  ).elements;
  */

  return (
    <div
      ref={previewRefDropRef} // Drop target и preview на всю колонку
      className={`w-100 bg-white rounded-lg shadow-md border-t-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ borderTopColor: colorHEX }}
    >
      <div
        ref={isUserTeamlead(currentUser, currentTeam) ? dragRef : null}
        onMouseDown={preventDrag}
        className="p-4"
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
              <div className="flex flex-row items-center">
                <h2
                  className="text-xl font-semibold text-gray-700 cursor-pointer"
                  onDoubleClick={renameColumn}
                >
                  {currentTitle}
                </h2>

                <div
                  className="mt-1 ml-2 text-sm rounded-full bg-gray"
                  title="Количество задач в колонке"
                >
                  <p>{tasksCount}</p>
                </div>
              </div>
            )}
          </div>

          {isUserStudent(currentUser) && !isUserMentor(currentUser) && (
            <KanbanColumnMenu
              onRename={renameColumn}
              onChangeColor={(color: string) => onUpdateColor(id, color)}
              onDelete={deleteColumn}
            />
          )}
        </div>
        {isUserStudent(currentUser) && !isUserMentor(currentUser) && (
          <>
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
            ) : (
              <button
                className="text-left text-blue hover:text-dark_blue"
                onClick={() => setCreatingTask('')}
              >
                + Создать задачу
              </button>
            )}
          </>
        )}
      </div>

      {!tasks && isLoading ? (
        <Skeleton />
      ) : (
        <div className="space-y-2 max-h-[calc(100vh-200px)] md-4 mt-2 overflow-y-scroll overflow-x-hidden">
          {tasks !== undefined && tasks !== null && (
            <AnimatePresence>{renderedTasks}</AnimatePresence>
          )}

          {/*tasks.map(
              (task, index) =>
                task &&
                task.id !== dndPlaceholder?.draggableId && (
                  <motion.div
                    key={task.id}
                    layout
                    transition={{
                      //type: 'spring',
                      //stiffness: 500,
                      //damping: 30,
                      //mass: 0.5,
                      duration: 0.14,
                    }}
                    className="task"
                  >
                    {index === dndPlaceholder?.hoverIndex &&
                    id === dndPlaceholder?.hoverColumnId ? (
                      <div
                        //ref={dropTaskRef}
                        className={`border border-blue border-separate rounded-lg`}
                        style={{
                          width: dndPlaceholder.draggableWidth,
                          height: dndPlaceholder.draggableHeight,
                        }}
                      ></div>
                    ) : (
                      <KanbanTask
                        id={task.id}
                        index={index}
                        columnId={id}
                        parentTaskId={null}
                        name={task.name}
                        isCompleted={task.isCompleted}
                        initialSubtaskCount={task.initialSubtaskCount}
                      />
                    )}
                  </motion.div>
                )
            )}
           */}
          {hasMore.current && (
            <button
              className="w-full p-3 bg-blue text-white rounded-[10px] duration-300"
              onClick={loadMoreTasks}
            >
              Загрузить еще
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
