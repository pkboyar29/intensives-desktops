import { FC, useEffect, useState } from 'react';
import { useGetColumnsTeamQuery } from '../redux/api/columnApi';
import { IColumn } from '../ts/interfaces/IColumn';
import KanbanColumn from '../components/KanbanColumn';
import DragKanbanColumn from '../components/DragComponents/DragKanbanColumn';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const KanbanBoardPage: FC = () => {

    const { data: columns, isLoading } = useGetColumnsTeamQuery(Number(1), {
        refetchOnMountOrArgChange: true,
    });

    const [kanbanColumns, setKanbanColumns] = useState<IColumn[]>([]);

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
        console.log(kanbanColumns[0])
    }, [kanbanColumns])

    // Функция для обновления позиций после перемещения
    const handleMoveColumn = (dragIndex: number, hoverIndex: number) => {
        const updatedColumns = [...kanbanColumns];
        const [movedColumn] = updatedColumns.splice(dragIndex, 1);
        updatedColumns.splice(hoverIndex, 0, movedColumn);

        // Обновляем позицию каждой колонки
        const newColumns = updatedColumns.map((col, index) => ({
        ...col,
        position: index + 1,
        }));

        setKanbanColumns(newColumns);

        // Дальше отправляем обновление на сервер   

    };

    // Функция для обновления названия
    const handleUpdateTitle = (newTitle: string) => {
        console.log(newTitle);
    }

    return(
    <div>
        <DndProvider backend={HTML5Backend}>
            <div>tut kolonki:</div>
            <div className='flex items-center space-x-4'>

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
            </div>
        </DndProvider>
        
    </div>
    );
}

export default KanbanBoardPage;