import { FC, useEffect, useState } from 'react';
import { useGetColumnsTeamQuery, useUpdateColumnPositionMutation, useUpdateColumnNameMutation, useCreateColumnMutation } from '../redux/api/columnApi';
import { IColumn } from '../ts/interfaces/IColumn';
import KanbanColumn from '../components/KanbanColumn';
import DragKanbanColumn from '../components/DragComponents/DragKanbanColumn';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const KanbanBoardPage: FC = () => {

    const { data: columns, isLoading } = useGetColumnsTeamQuery(Number(1), {
        refetchOnMountOrArgChange: true,
    });

    const [createColumnAPI] = useCreateColumnMutation();
    const [updateColumnPositionAPI] = useUpdateColumnPositionMutation();
    const [updateColumnNameAPI] = useUpdateColumnNameMutation();
    const [kanbanColumns, setKanbanColumns] = useState<IColumn[]>([]);

    const [isColumnCreating, setColumnCreating] = useState(false);
    const [currentColumnCreatingName, setCurrentColumnCreatingName] = useState("");

    useEffect(() => {
        if (columns) {
          //console.log("columns: "+columns)
          setKanbanColumns(columns);
        }
        else{
            console.log("not columns")
        }
    });

    useEffect(() => {
        //console.log(kanbanColumns[0])
    }, [kanbanColumns])

    // Функция для обновления позиций после перемещения
    const handleMoveColumn = (dragIndex: number, hoverIndex: number) => {
        console.log("dragIndex: " + dragIndex + " hoverIndex: " + hoverIndex)
        const updatedColumns = [...kanbanColumns];
        const [movedColumn] = updatedColumns.splice(dragIndex, 1);
        console.log(movedColumn.id)
        updateColumnPosition(movedColumn, hoverIndex)
    };

    const updateColumnPosition = async (column: IColumn, newPosition: number) => {
        const { data: responseData } = await updateColumnPositionAPI({
            id: column.id,
            position: newPosition,
        });

        console.log(responseData)
    }

    // Функция для обновления названия
    const handleUpdateTitle = async (id: number, newTitle: string) => {
        const { data: responseData } = await updateColumnNameAPI({
            id: id,
            name: newTitle,
        });
    }

    const createColumn = async () => {
        
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentColumnCreatingName(e.target.value);
    };

    const handleBlur = () => {
        setColumnCreating(false);
        
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setColumnCreating(false);
        }
    };


    return(
    <div>
        <DndProvider backend={HTML5Backend}>
            <div>tut kolonki:</div>
            <div className='flex items-start space-x-4'>

                {kanbanColumns
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
                    />
                ))}
                
                {isColumnCreating ? (
                    <input
                        type="text"
                        defaultValue={""}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        onChange={handleInputChange}
                        autoFocus
                        className="text-xl font-semibold text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-50" />
                    ) : (
                    <button className='w-50 p-4 bg-blue text-white rounded-[10px] duration-300' onClick={() => setColumnCreating(true)}>Создать колонку</button>
                )}
            </div>
        </DndProvider>
        
    </div>
    );
}

export default KanbanBoardPage;