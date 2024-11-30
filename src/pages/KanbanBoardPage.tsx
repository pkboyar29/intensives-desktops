import { FC, useEffect, useState } from 'react';
import { useGetColumnsTeamQuery } from '../redux/api/columnApi';
import { IColumn } from '../ts/interfaces/IColumn';
import KanbanColumn from '../components/KanbanColumn';

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
                <KanbanColumn title='backend' colorHEX='#FF7D7D' />
                <KanbanColumn title='frontend' colorHEX='#7DA2FF' />
            </div>
        </div>
    );
}

export default KanbanBoardPage;