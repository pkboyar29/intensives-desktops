export interface IFile {
  id: number;
  name: string;
  size: number;
  createdDt?: Date;
}

export interface IDownloadFile {
  context: string; // можно задать конкретные значения, если известно множество вариантов
  contextId: number;
  fileId: number;
}

export interface IUploadFileContext {
  context: string;
  contextId: number;
  files: File | File[];
}
export interface IUploadFile {
  contextId: number;
  files: File | File[];
}

export interface INewFileObject {
  file: File; // Стандартный тип для файлов
  id: number; // Уникальный идентификатор
}
