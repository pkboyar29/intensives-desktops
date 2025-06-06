import { FC, useState, useEffect, useRef, useMemo } from 'react';
import KanbanTaskMenu from './KanbanTaskMenu';
import {
  useLazyGetSubtasksQuery,
  useCreateTaskMutation,
  useUpdateTaskPositionMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from '../redux/api/taskApi';
import {
  getPayloadForUpdatingTaskPosition,
  useCombinedRefs,
  validateKanban,
} from '../helpers/kanbanHelpers';
import { useAppSelector, useAppDispatch } from '../redux/store';
import {
  moveTaskTemporary,
  savePreviousState,
  makeSelectSubtaskData,
  setMovingPlaceholder,
} from '../redux/slices/kanbanSlice';
import { useDrag, useDrop } from 'react-dnd';
import React from 'react';
import { ITaskPositionUpdate } from '../ts/interfaces/ITask';
import KanbanAssigneeMenu from './KanbanAssigneeMenu';
import { motion } from 'framer-motion';
import { isUserMentor, isUserStudent } from '../helpers/userHelpers';

interface KanbanTaskProps {
  id: number;
  index: number;
  columnId: number;
  parentTaskId: number | null;
  name: string;
  isCompleted: boolean;
  assignees?: number[];
  initialSubtaskCount?: number | null;
  deadlineStart?: string;
  deadlineEnd?: string;
  onClick?: () => void;
  onClickComplete?: () => void;
}

const KanbanTask: FC<KanbanTaskProps> = ({
  id,
  index,
  columnId,
  parentTaskId,
  name,
  isCompleted,
  assignees,
  initialSubtaskCount,
  deadlineStart,
  deadlineEnd,
  onClick,
}) => {
  const dispatch = useAppDispatch();
  const [getSubtasks, { isLoading, isError }] = useLazyGetSubtasksQuery();
  const [createTaskAPI] = useCreateTaskMutation();
  const [updateTaskAPI] = useUpdateTaskMutation();
  const [updateTaskPositionAPI] = useUpdateTaskPositionMutation();
  const [deleteTaskAPI] = useDeleteTaskMutation();

  const [isExpandedSubtasks, setIsExpandedSubtasks] = useState(false); // Состояние для раскрытия подзадач
  const [creatingSubtask, setCreatingSubtask] = useState<string | null>(null);
  const [currentDropPlaceholder, setCurrentDropPlaceholder] = useState<
    number | undefined
  >();
  const [taskSize, setTaskSize] = useState({ width: 0, height: 0 });
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentName, setCurrentName] = useState<string>(name);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea создание подзадачи
  const textareaNameRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea редактирования названия задачи
  const taskRef = useRef<HTMLDivElement>(null);

  // Получаем данные подзадач
  const selectSubtasksData = useMemo(() => makeSelectSubtaskData(id), [id]);
  const subtasksData = useAppSelector(selectSubtasksData);

  // Получаем количество подзадач
  const subtaskCount = useAppSelector(
    (state) => state.kanban.subtasks?.[id]?.length || 0
  );

  const dndPlaceholder = useAppSelector(
    (state) => state.kanban.dndTaskPlaceholderIndex
  );
  const currentUser = useAppSelector((state) => state.user.data);

  useEffect(() => {
    if (taskRef.current) {
      const { width, height } = taskRef.current.getBoundingClientRect();
      setTaskSize({ width, height });
    }
  }, []);

  // Функция для автоматического изменения высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Сбрасываем высоту
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [creatingSubtask]);

  useEffect(() => {
    const textarea = textareaNameRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // сброс текущей высоты
      textarea.style.height = textarea.scrollHeight + 'px'; // установка нужной
    }
  }, [currentName, isEditingName]); // триггер при изменении названия задачи

  const renameTask = () => {
    setIsEditingName(true);
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

  const handleBlurRename = () => {
    updateTaskName();
    /*
    if (currentName && validateKanban(currentName)) {
      updateTaskName();
    } else {
      console.log(currentName);
      setCurrentName(name);
    }
    */
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      //handleBlur();
    }
  };

  const createSubtask = async () => {
    try {
      if (creatingSubtask) {
        await createTaskAPI({
          name: creatingSubtask,
          parentTask: id,
        }).unwrap();
      }
    } catch (err) {
      console.error('Error on crating subtask:', err);
    }
  };

  const updateTaskPosition = async (payload: ITaskPositionUpdate) => {
    console.log(payload);
    try {
      await updateTaskPositionAPI(payload);
    } catch (err) {
      console.error('Error on updating position subtask:', err);
    }
  };

  const updateTaskName = async () => {
    try {
      await updateTaskAPI({ id: id, name: currentName });
    } catch (err) {
      setCurrentName(name); // сбрасываем состояние при ошибке переименования
      console.error('Ошибка при обновлении названия задачи ', err);
    }
  };

  const updateTaskAssignees = async (assigneesId: number[]) => {
    try {
      await updateTaskAPI({ id: id, assignees: assigneesId });
    } catch (err) {
      console.error('Ошибка при добавлении исполнителей на задачу', err);
    }
  };

  const deleteTask = async () => {
    try {
      await deleteTaskAPI(id).unwrap();
    } catch (error) {
      console.error(`Error on deleting subtask id=${id}`, error);
    }
  };

  const loadSubtasksData = async () => {
    if (!isExpandedSubtasks && subtaskCount === 0) {
      // Загружаем подзадачи, если они ещё не загружены
      await getSubtasks(id);
    }
  };

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    type: 'TASK',
    item: { id, index, columnId, parentTaskId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),

    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!dndPlaceholder) return;

      console.log('drop');
      dispatch(
        setMovingPlaceholder({
          draggableId: null,
        })
      );
      // Если не сдвинули
      if (
        item.columnId === columnId &&
        item.index === dndPlaceholder.hoverIndex
      ) {
        return;
      }

      /*
      dispatch(savePreviousState());
      dispatch(
        moveTaskTemporary({
          taskId: item.id,
          dragIndex: item.index,
          hoverIndex: index,
          fromColumnId: item.columnId,
          toColumnId: columnId,
          fromParentTaskId: item.parentTaskId,
          toParentTaskId: parentTaskId,
          //insertPosition: dndPlaceholder?.insertPosition,
        })
      );

      updateTaskPosition({
        id: item.id,
        position: index,
        column: columnId,
        parentTask: parentTaskId !== null ? parentTaskId : undefined,
      });
      */
      // Объект дропнули мимо
      if (!didDrop) {
        console.log('did drop');
        dispatch(
          setMovingPlaceholder({
            draggableId: null,
          })
        );
      }
    },
  });

  const [, dropRef] = useDrop({
    accept: 'TASK',
    hover: (
      item: {
        id: number;
        index: number;
        columnId: number | null;
        parentTaskId: number | null;
      },
      monitor
    ) => {
      //console.log('dg');
      //dispatch(savePreviousState());
      if (!taskRef.current) return;

      /*
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const boundingRect = taskRef.current.getBoundingClientRect();

      const y = clientOffset.y;
      const top = boundingRect.top;
      const height = boundingRect.height;

      const relativeY = (y - top) / height; //высота блока от 0 до 1 (проценты)
      const offset = 0.25; // смещение (к центру)

      if (relativeY > 1 - offset) {
        console.log('вне смещения');
        // Если наведение в пределах смещения - ничего не делаем
        return;
      }

      /*
      const hoverMiddleY = (boundingRect.bottom - top) / 2;
      const cursorY = y - top;

      var insertPosition: 'top' | 'bottom';
      if (cursorY < hoverMiddleY) {
        insertPosition = 'top';
      } else {
        insertPosition = 'bottom';
      } // + проверка на половины текущей задачи или че то с этим сделать
      */

      if (
        item.index !== index ||
        item.columnId !== columnId ||
        item.parentTaskId !== parentTaskId
      ) {
        //console.log(item.id, id);
        // Чтобы состояние не топталось на месте
        if (
          id === dndPlaceholder?.hoverId
          //insertPosition === dndPlaceholder.insertPosition
        ) {
          //console.log(dndPlaceholder.draggableIndex);
          return;
        }

        dispatch(
          setMovingPlaceholder({
            draggableId: item.id,
            draggableIndex: dndPlaceholder?.hoverIndex || item.index,
            draggableColumnId: dndPlaceholder?.hoverColumnId || item.columnId,
            hoverId: id,
            hoverIndex: index,
            hoverColumnId: columnId,
            hoverParentTaskId: parentTaskId,
            draggableWidth: taskSize.width,
            draggableHeight: taskSize.height,
            //flaggedPlaceholder: true,
            //insertPosition: insertPosition,
          })
        );
        //setCurrentDropPlaceholder(index);
        /*
        dispatch(savePreviousState());
        dispatch(
          moveTaskTemporary({
            taskId: item.id,
            dragIndex: item.index,
            hoverIndex: index,
            fromColumnId: item.columnId,
            toColumnId: columnId,
            fromParentTaskId: item.parentTaskId,
            toParentTaskId: parentTaskId,
          })
        );
        */
        //item.index = index;
        ///item.columnId = columnId;
        //item.parentTaskId = parentTaskId;
      }
    },
    collect: (monitor) => {
      if (
        !monitor.isOver() &&
        dndPlaceholder &&
        dndPlaceholder?.hoverId !== null
      ) {
        //console.log('Вышли из зоны hover');
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
      //console.log('item.columnId:' + item.columnId + 'columnId: ' + columnId);
      //console.log(item.id, id);
      dispatch(
        setMovingPlaceholder({
          draggableId: null,
        })
      );
      // Если не сдвинули
      if (item.id === id) return;

      dispatch(savePreviousState());
      dispatch(
        moveTaskTemporary({
          taskId: item.id,
          dragIndex: item.index,
          hoverIndex: index,
          fromColumnId: item.columnId,
          toColumnId: columnId,
          fromParentTaskId: item.parentTaskId,
          toParentTaskId: parentTaskId,
          insertPosition: dndPlaceholder?.insertPosition,
        })
      );

      updateTaskPosition({
        id: item.id,
        position: index,
        column: columnId,
        parentTask: parentTaskId !== null ? parentTaskId : undefined,
      });
    },
  });

  // Соединяем drag и dropRef
  const dragDropRef = (node: HTMLDivElement | null) => {
    dragRef(node);
    dropRef(node);
  };
  const dragTaskRef = useCombinedRefs<HTMLDivElement>(dragRef, taskRef);

  // Логика отображения количества подзадач
  const displayedSubtaskCount =
    initialSubtaskCount !== null && initialSubtaskCount! > 0
      ? initialSubtaskCount // Показываем изначальное значение
      : subtaskCount; // После подгрузки показываем актуальное значение

  return (
    <>
      <div
        className={`flex flex-col mb-3 mr-3 ml-3 transition-shadow border border-gray-200 rounded-lg hover:shadow-md hover:border-gray_3 duration-75 bg-bg_gray
      ${isDragging ? 'opacity-50' : ''}`}
        onClick={onClick}
        ref={previewRef}
      >
        <div ref={dropRef}>
          {id === dndPlaceholder?.hoverId &&
            dndPlaceholder.insertPosition === 'top' && (
              <div
                className={`border border-blue border-separate rounded-lg`}
                style={{
                  width: dndPlaceholder.draggableWidth,
                  height: dndPlaceholder.draggableHeight,
                }}
              ></div>
            )}
          <div
            className={`flex flex-col justify-between p-3 rounded-lg cursor-pointer ${
              id === dndPlaceholder?.hoverId &&
              'border border-blue duration-100'
            }`}
            ref={
              isUserStudent(currentUser) && !isUserMentor(currentUser)
                ? dragTaskRef
                : null
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex justify-between space-x-2 ml">
              <div className="flex space-x-3">
                {/*
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                />*/}
                <div className="w-[180px] break-words text-l text-gray-700 font-normal ">
                  {isEditingName ? (
                    <textarea
                      ref={textareaNameRef}
                      value={currentName}
                      onChange={(e) => setCurrentName(e.target.value)}
                      onBlur={handleBlurRename}
                      onKeyDown={handleKeyDown}
                      maxLength={500}
                      placeholder="Введите название задачи..."
                      autoFocus
                      className="w-full p-0 m-0 overflow-hidden leading-none whitespace-pre-wrap bg-transparent border-b resize-none border-gray_3"
                    />
                  ) : (
                    <p
                      className=""
                      onDoubleClick={() => setIsEditingName(true)}
                    >
                      {currentName}
                    </p>
                  )}
                </div>
              </div>

              {isUserStudent(currentUser) && !isUserMentor(currentUser) && (
                <KanbanTaskMenu
                  onRename={renameTask}
                  onCreateSubtask={
                    !parentTaskId
                      ? () => {
                          loadSubtasksData();
                          setIsExpandedSubtasks(true);
                          setCreatingSubtask('');
                        }
                      : undefined
                  }
                  onDelete={deleteTask}
                />
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              {/*<span className="inline-block px-2 py-1 mt-2 text-xs text-gray-600 rounded bg-gray">
                {id}
              </span>
              {assignees && assignees.length > 0 ? (
                <div className="flex items-center justify-center text-xs font-semibold text-black bg-blue-500 rounded-full w-7 h-7">
                  исполнители
                </div>
              ) : (
                <KanbanAssigneeMenu
                  onAddAssignee={(ids: number[]) => updateTaskAssignees(ids)}
                  isVisibleButton={false} //isHoveres
                />
              )}
              */}
            </div>
          </div>
          {id === dndPlaceholder?.hoverId &&
            dndPlaceholder.insertPosition === 'bottom' && (
              <div
                className={`border border-blue border-separate rounded-lg`}
                style={{
                  width: dndPlaceholder.draggableWidth,
                  height: dndPlaceholder.draggableHeight,
                }}
              ></div>
            )}
        </div>
        {/* Область с подзадачами */}
        <div className="flex flex-col bg-gray">
          {displayedSubtaskCount ? (
            <div
              className="flex flex-row justify-end mt-1 mb-1 mr-1 space-x-2 cursor-pointer"
              onClick={() => {
                loadSubtasksData();
                setIsExpandedSubtasks((prev) => !prev);
              }}
            >
              <p className="">{displayedSubtaskCount}</p>
              {isExpandedSubtasks ? <p>&#x25B2;</p> : <p>&#x25BC;</p>}
            </div>
          ) : (
            <></>
          )}

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
            <button
              className="text-left text-blue hover:text-dark_blue"
              onClick={() => setCreatingSubtask('')}
            ></button>
          )}

          {isExpandedSubtasks && subtasksData.length > 0 && (
            <div>
              {subtasksData.map((subtask, index) => {
                if (!subtask) return null;

                return (
                  <motion.div
                    key={subtask.id}
                    layout
                    transition={{ duration: 0.14 }}
                  >
                    <KanbanTask
                      id={subtask.id}
                      columnId={subtask.column}
                      parentTaskId={id}
                      index={index}
                      name={subtask.name}
                      isCompleted={subtask.isCompleted}
                      initialSubtaskCount={subtask.initialSubtaskCount}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KanbanTask;
