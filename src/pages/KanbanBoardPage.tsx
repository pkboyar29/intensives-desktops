import { FC, useEffect, useRef, useState } from 'react';
import {
  useUpdateColumnPositionMutation,
  useUpdateColumnNameMutation,
  useUpdateColumnColorMutation,
  useCreateColumnMutation,
  useLazyGetColumnsTeamQuery,
  useDeleteColumnMutation,
} from '../redux/api/columnApi';
import { validateKanban } from '../helpers/kanbanHelpers';
import { IColumn } from '../ts/interfaces/IColumn';
import { Helmet } from 'react-helmet-async';
import KanbanColumn from '../components/KanbanColumn';
import Modal from '../components/common/modals/Modal';
import PrimaryButton from '../components/common/PrimaryButton';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect'; // или свой способ определения

import { useAppSelector, useAppDispatch } from '../redux/store';
import { moveColumnTemporary } from '../redux/slices/kanbanSlice';
import { isUserTeamlead } from '../helpers/userHelpers';

const KanbanBoardPage: FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);
  const columns = useAppSelector((state) => state.kanban.columns);

  const [getColumns, { isLoading, isError }] = useLazyGetColumnsTeamQuery();

  const [createColumnAPI] = useCreateColumnMutation();
  const [updateColumnPositionAPI] = useUpdateColumnPositionMutation();
  const [updateColumnNameAPI] = useUpdateColumnNameMutation();
  const [updateColumnColorAPI] = useUpdateColumnColorMutation();
  const [deleteColumnAPI] = useDeleteColumnMutation();

  const [kanbanColumns, setKanbanColumns] = useState<IColumn[]>([]);

  const [isColumnCreating, setColumnCreating] = useState(false);
  const [currentColumnCreatingName, setCurrentColumnCreatingName] =
    useState('');

  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  useEffect(() => {
    if (currentTeam && (!columns || columns?.length === 0)) {
      getColumns(currentTeam.id);
      console.log(currentTeam);
      console.log(currentUser);
    }
  }, [currentTeam]);

  useEffect(() => {
    console.log(isMobile);
  }, [isMobile]);

  useEffect(() => {
    console.log('columns updated', columns);
    //console.log('render kanbanboard');
  }, [columns]);

  // Функция для обновления позиций после перемещения
  const handleMoveColumn = (dragIndex: number, hoverIndex: number) => {
    dispatch(moveColumnTemporary({ dragIndex, hoverIndex }));
  };

  const handleDropColumn = (columnId: number, newIndex: number) => {
    updateColumnPosition(columnId, newIndex);
  };

  const updateColumnPosition = async (
    columnId: number,
    newPosition: number
  ) => {
    const { data: responseData } = await updateColumnPositionAPI({
      id: columnId,
      position: newPosition,
    });
  };

  // Функция для обновления названия
  const handleUpdateTitle = async (id: number, newTitle: string) => {
    const { data: responseData } = await updateColumnNameAPI({
      id: id,
      name: newTitle,
    });
  };

  // Функция для обновления цвета
  const handleUpdateColor = async (id: number, newColorHEX: string) => {
    const { data: responseData } = await updateColumnColorAPI({
      id: id,
      colorHEX: newColorHEX,
    });
  };

  const createColumn = async () => {
    if (validateKanban(currentColumnCreatingName) && currentTeam) {
      try {
        await createColumnAPI({
          name: currentColumnCreatingName,
          team: Number(currentTeam.id),
        }).unwrap();
      } catch (error) {
        console.error('Error during column creation:', error);
      }
    }

    setCurrentColumnCreatingName(''); // обнуляем хук с названием
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColumnCreatingName(e.target.value);
  };

  const handleBlur = () => {
    setColumnCreating(false);
    createColumn();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setColumnCreating(false);
      createColumn();
    }
  };

  const handleDeleteColumn = async (id: number) => {
    try {
      await deleteColumnAPI(id).unwrap();
    } catch (error) {
      console.error('Error on deleting column:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{currentTeam && `Ведение задач | ${currentTeam.name}`}</title>
      </Helmet>

      {deleteModal && (
        <Modal
          title="Удаление колонки"
          onCloseModal={() => setDeleteModal(null)}
        >
          <p className="text-lg text-bright_gray">
            {`Вы уверены, что хотите удалить колонку? ВСЕ задачи и подзадачи в ней удалятся!`}
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => setDeleteModal(null)}
                children="Отмена"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  setDeleteModal(null);
                  handleDeleteColumn(deleteModal);
                }}
                children="Удалить"
              />
            </div>
          </div>
        </Modal>
      )}

      <div className="w-full">
        <DndProvider
          backend={isMobile ? TouchBackend : HTML5Backend}
          options={isMobile ? { enableMouseEvents: true } : undefined}
        >
          <div className="flex items-start space-x-4">
            {columns &&
              columns.map((column, index) => (
                <div
                  key={column.id}
                  className="flex-shrink-0 min-w-[300px] max-w-[300px]"
                >
                  <KanbanColumn
                    key={column.id}
                    index={index}
                    id={column.id}
                    title={column.name}
                    colorHEX={column.colorHEX}
                    tasksCount={column.tasksCount}
                    moveColumn={handleMoveColumn}
                    dropColumn={handleDropColumn}
                    onUpdateTitle={handleUpdateTitle}
                    onUpdateColor={handleUpdateColor}
                    onDeleteColumn={(idColumn) => setDeleteModal(idColumn)}
                  />
                </div>
              ))}

            {isUserTeamlead(currentUser, currentTeam) && (
              <>
                {isColumnCreating ? (
                  <input
                    type="text"
                    defaultValue={''}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    maxLength={50}
                    autoFocus
                    className="text-xl font-semibold text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-50"
                  />
                ) : (
                  <button
                    className="w-50 p-4 bg-blue text-white rounded-[10px] duration-300"
                    onClick={() => setColumnCreating(true)}
                  >
                    Создать колонку
                  </button>
                )}
              </>
            )}
          </div>
        </DndProvider>
      </div>
    </>
  );
};

export default KanbanBoardPage;
