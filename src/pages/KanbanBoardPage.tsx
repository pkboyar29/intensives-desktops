import { FC, useEffect, useState } from 'react';
import {
  useUpdateColumnPositionMutation,
  useUpdateColumnNameMutation,
  useCreateColumnMutation,
  useLazyGetColumnsTeamQuery,
  useDeleteColumnMutation
} from '../redux/api/columnApi';
import { IColumn } from '../ts/interfaces/IColumn';
import KanbanColumn from '../components/KanbanColumn';
import DragKanbanColumn from '../components/DragComponents/DragKanbanColumn';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useAppSelector } from '../redux/store';

const KanbanBoardPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);

  const [getColumns, { data: columns, isLoading }] =
    useLazyGetColumnsTeamQuery();

  const [createColumnAPI] = useCreateColumnMutation();
  const [updateColumnPositionAPI] = useUpdateColumnPositionMutation();
  const [updateColumnNameAPI] = useUpdateColumnNameMutation();
  const [deleteColumnAPI] = useDeleteColumnMutation();

  const [kanbanColumns, setKanbanColumns] = useState<IColumn[]>([]);

  const [isColumnCreating, setColumnCreating] = useState(false);
  const [currentColumnCreatingName, setCurrentColumnCreatingName] =
    useState('');

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
    //const updatedColumns = [...columns];
    //const [movedColumn] = columns?.splice(dragIndex, 1);
    //console.log(movedColumn.id);
    updateColumnPosition(columnId, hoverIndex);
  };

  const updateColumnPosition = async (columnId: number, newPosition: number) => {
    const { data: responseData } = await updateColumnPositionAPI({
      id: columnId,
      position: newPosition,
    });

    if(currentTeam) {
      getColumns(currentTeam.index);
    }
  };

  // Функция для обновления названия
  const handleUpdateTitle = async (id: number, newTitle: string) => {
    const { data: responseData } = await updateColumnNameAPI({
      id: id,
      name: newTitle,
    });
  };

  const createColumn = async () => {

    if(validateColumnName(currentColumnCreatingName) && currentTeam) {
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

  const validateColumnName = (name: string): boolean => {
    const regex = /^[a-zA-Zа-яА-Я0-9 _-]+$/; // Регулярка для разрешенных символов
    if(name.trim() === '') {
      return false;
    }
    if(!regex.test(name)) {
      return false;
    }
    return true;
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
    <div className=''>
      <DndProvider backend={HTML5Backend}>
        <div className="flex items-start space-x-4">
          {columns &&
          columns
            .slice() // Создаем копию массива, чтобы не мутировать исходный массив
            .sort((a, b) => a.position - b.position) // Сортировка колонок по позиции
            .map((column, index) => (
              <KanbanColumn
                key={column.id}
                index={index}
                id={column.id}
                title={column.name}
                colorHEX={column.colorHEX}
                moveColumn={handleMoveColumn}
                onUpdateTitle={handleUpdateTitle}
                onDeleteColumn={handleDeleteColumn}
              />
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
  );
};

export default KanbanBoardPage;
