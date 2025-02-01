export interface IFile {
  id: number;
  name: string;
  size: number;
  createdDt?: Date;
}

export interface IDownloadFileParams {
  context: 'intensives' | string; // можно задать конкретные значения, если известно множество вариантов
  contextId: number;
  fileId: number;
}