import { FC, useEffect, useState } from 'react';
import {
  useUpdateColumnPositionMutation,
  useUpdateColumnNameMutation,
  useCreateColumnMutation,
  useLazyGetColumnsTeamQuery,
  useDeleteColumnMutation
} from '../redux/api/columnApi';
import { validateKanban } from '../helpers/kanbanHelpers';
import { IColumn } from '../ts/interfaces/IColumn';
import KanbanColumn from '../components/KanbanColumn';
import Modal from '../components/common/modals/Modal';
import PrimaryButton from '../components/common/PrimaryButton';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useAppSelector } from '../redux/store';

const KanbanBoardPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);
  const columns = useAppSelector((state) => state.kanban.columns);

  const [getColumns, { isLoading, isError }] = useLazyGetColumnsTeamQuery();

  const [createColumnAPI] = useCreateColumnMutation();
  const [updateColumnPositionAPI] = useUpdateColumnPositionMutation();
  const [updateColumnNameAPI] = useUpdateColumnNameMutation();
  const [deleteColumnAPI] = useDeleteColumnMutation();

  const [kanbanColumns, setKanbanColumns] = useState<IColumn[]>([]);

  const [isColumnCreating, setColumnCreating] = useState(false);
  const [currentColumnCreatingName, setCurrentColumnCreatingName] = useState('');

  const [deleteModal, setDeleteModal] = useState<number | null>(null);

  useEffect(() => {
    if (currentTeam) {
      getColumns(currentTeam.index);
    }
  }, [currentTeam]);

  useEffect(() => {

  });

  useEffect(() => {
    console.log(columns)
  }, [columns])


  // Функция для обновления позиций после перемещения
  const handleMoveColumn = (columnId: number, dragIndex: number, hoverIndex: number) => {
    console.log('columnId: ' + columnId + 'dragIndex: ' + dragIndex + ' hoverIndex: ' + hoverIndex);
    updateColumnPosition(columnId, hoverIndex);
  };

  const updateColumnPosition = async (columnId: number, newPosition: number) => {
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

  const createColumn = async () => {

    if(validateKanban(currentColumnCreatingName) && currentTeam) {
        try{
          await createColumnAPI({
              name: currentColumnCreatingName,
              team: Number(currentTeam.id),
          }).unwrap();
          
        } catch(error){
          console.error("Error during column creation:", error);
        }
    }

    setCurrentColumnCreatingName("") // обнуляем хук с названием
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
    
    try{
      await deleteColumnAPI(id).unwrap();
      
    } catch(error) {
      console.error("Error on deleting column:", error);
    }
  }

  return (
    <>
    {deleteModal && (
      <Modal
        title="Удаление колонки"
        onCloseModal={() => setDeleteModal(null)}
      >
        <p className="text-lg text-bright_gray">
          {`Вы уверены, что хотите удалить колонку? ВСЕ задачи в ней удалятся`}
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
                setDeleteModal(null)
                handleDeleteColumn(deleteModal);
              }}
              children="Удалить"
            />
          </div>
        </div>
      </Modal>
    )}
      
    <div className='w-full'>
      <DndProvider backend={HTML5Backend}>
        <div className="flex items-start space-x-4">
          {columns &&
          columns
            .map((column, index) => (
              <div key={column.id} className="flex-shrink-0 min-w-[300px]">
                <KanbanColumn
                  key={column.id}
                  index={index}
                  id={column.id}
                  title={column.name}
                  colorHEX={column.colorHEX}
                  moveColumn={handleMoveColumn}
                  onUpdateTitle={handleUpdateTitle}
                  onDeleteColumn={(idColumn) => setDeleteModal(idColumn)}
                />
              </div>
          ))}

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
              onClick={() => setColumnCreating(true)}>
              Создать колонку
            </button>
          )}
        </div>
      </DndProvider>
    </div>
    </>
  );
};

export default KanbanBoardPage;
