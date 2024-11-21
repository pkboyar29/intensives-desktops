import { FC, useEffect, useState } from 'react';
import { useGetColumnsTeamQuery } from '../redux/api/columnApi';
import { IColumn } from '../ts/interfaces/IColumn';

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
        <div>d</div>
    );
}

export default KanbanBoardPage;