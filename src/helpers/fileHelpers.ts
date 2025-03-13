import { toast } from 'react-toastify';
import { INewFileObject } from '../ts/interfaces/IFile';

// Функция для форматирования размера файла
export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// Функция для получения уникальных файлов по сравнению новых с уже выбранными
export const getUniqueFiles = (newFiles: File[], files: INewFileObject[]) => {
  return newFiles.filter((file) => {
    return !files.some(
      (existing) =>
        existing.file.name === file.name &&
        existing.file.size === file.size &&
        existing.file.lastModified === file.lastModified
    );
  });
};

export const uploadAllFiles = async (
  uploadFiles: any,
  context: string,
  contextId: number,
  newFiles: INewFileObject[]
) => {
  let filesError = 0;

  if (newFiles.length === 0) {
    console.error('newFiles пуст');
    return filesError;
  }

  let responseData;
  let responseError;

  for (const newFile of newFiles) {
    // Показываем уведомление загрузки
    const toastId = toast.loading(`Загрузка файла: ${newFile.file.name}...`);

    ({ data: responseData, error: responseError } = await uploadFiles({
      context: context,
      contextId: Number(contextId),
      files: newFile.file,
    }));

    if (responseError) {
      filesError++;
      toast.update(toastId, {
        render: `Ошибка загрузки: ${newFile.file.name}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      continue; // Переход к следующему файлу
    }

    // Просто скрываем toast загрузки при успехе
    toast.dismiss(toastId);
  }

  return filesError;
};
