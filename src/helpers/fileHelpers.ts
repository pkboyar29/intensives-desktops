import { INewFileObject } from "../ts/interfaces/IFile";

// Функция для форматирования размера файла
export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// Функция для получения уникальных файлов по сравнению новых с уже выбранными
export const getUniqueFiles = (newFiles: File[], files: INewFileObject[]) => {
  return newFiles.filter(file => {
    return !files.some(existing => (
      existing.file.name === file.name &&
      existing.file.size === file.size &&
      existing.file.lastModified === file.lastModified
    ));
  })
};