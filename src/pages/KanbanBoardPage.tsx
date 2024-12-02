import { FC, useEffect, useState } from 'react';
import { useGetColumnsTeamQuery } from '../redux/api/columnApi';
import { IColumn } from '../ts/interfaces/IColumn';
import KanbanColumn from '../components/KanbanColumn';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const KanbanBoardPage: FC = () => {

    const { data: columns, isLoading } = useGetColumnsTeamQuery(Number(1), {
        refetchOnMountOrArgChange: true,
    });

    const [kanbanColumns, setKanbanColumns] = useState<IColumn[]>(
        []
    );

    useEffect(() => {
        if (columns) {
          console.log("columns: "+columns)
          setKanbanColumns(columns);
        }
        else{
            console.log("not columns")
        }
    });

    useEffect(() => {
        console.log(kanbanColumns[0])
    }, [kanbanColumns])

    return(
        <div>
            <div>tut kolonki:</div>
            <div className='flex items-center space-x-4'>
                {kanbanColumns.map((column) => (
                    <KanbanColumn
                    key={column.id} // Важно добавить уникальный ключ
                    title={column.name}
                    colorHEX={column.colorHEX}
                    />
                ))}
            </div>
        </div>
    );
}

export default KanbanBoardPage;