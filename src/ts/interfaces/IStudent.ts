export interface IStudent {
  id: number;
  group: {
    id: number;
    flowId: number;
  };
  nameWithGroup: string;
}
