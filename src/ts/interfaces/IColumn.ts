export interface IColumn {
    id: number;
    name: string;
    colorHEX: string;
    position: number;
    team: number;
}

export interface IColumnWithTasksIds extends IColumn {
    taskIds: number[]; // Список ID задач
}

export interface IColumnCreate {
    name: string;
    team: number;
}

export interface IColumnPositionUpdate {
    id: number;
    position: number;
}