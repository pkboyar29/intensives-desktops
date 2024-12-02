export interface IColumn {
    id: number;
    name: string;
    colorHEX: string;
    position: number;
    team: number;
}

export interface IColumnCreate {
    name: string;
    colorHEX: string;
    team: number;
}

export interface IColumnUpdate {
    name: string;
    colorHEX: string;
    position: number;
    team: number;
}