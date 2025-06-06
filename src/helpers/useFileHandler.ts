import { useState } from 'react';
import { toast } from 'react-toastify';
import { IFile, INewFileObject } from '../ts/interfaces/IFile';
import { getUniqueFiles } from './fileHelpers';

// Кастомный хук управления файлами
export const useFileHandler = (initialFiles: IFile[] = []) => {
  const [attachedFilesList, setAttachedFilesList] =
    useState<IFile[]>(initialFiles);
  const [newFiles, setNewFiles] = useState<INewFileObject[]>([]);

  // Обработка новых файлов
  const handleFilesChange = (selectedFiles: File[] | null) => {
    if (selectedFiles) {
      //const selectedFiles: File[] = Array.from(fileList);
      console.log(
        'Выбранные файлы:',
        selectedFiles.map((file) => file.name)
      );

      const uniqueFiles = getUniqueFiles(selectedFiles, newFiles);

      // Если какие-то файлы оказались дубликатами уведомляем
      if (uniqueFiles.length < selectedFiles.length) {
        toast.warning('Ошибка загрузки файла!', {
          draggable: true, // Позволяет смахивать
          closeOnClick: true, // Закрытие по нажатию
          autoClose: 3000,
        });
      }

      // Если нет новых файлов после фильтрации, выходим
      if (uniqueFiles.length === 0) return;

      // Генерируем ID один раз и создаём сразу оба массива
      const newFilesData = uniqueFiles.map((file, index) => {
        // Генерируем временный ID файла для списка в UI и массива newFiles
        // Отрицательное значение означает временный ID
        const tempId = (Date.now() + index) * -1;

        return {
          attachedFile: {
            id: tempId,
            name: file.name,
            size: file.size,
          },
          newFileObject: {
            file,
            id: tempId,
          },
        };
      });

      // Добавляем к существующим файлам в списке файлов (просто UI)
      setAttachedFilesList((prev) => [
        ...prev,
        ...newFilesData.map((item) => item.attachedFile),
      ]);

      // Добавляем сами объекты файлов в newFiles (для отправки)
      setNewFiles((prev) => [
        ...prev,
        ...newFilesData.map((item) => item.newFileObject),
      ]);
    }
  };

  const handleFileDelete = (id: number) => {
    // Удаляем файл из массива для UI и массива с файлами (если файл новый)
    setAttachedFilesList((prev) => prev.filter((file) => file.id !== id));
    setNewFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return {
    attachedFilesList,
    newFiles,
    handleFilesChange,
    setAttachedFilesList,
    setNewFiles,
    handleFileDelete,
  };
};
