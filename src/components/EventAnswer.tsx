import { FC, useState, useEffect } from 'react';
import {
  useLazyGetEventAnswerQuery,
  useUpdateEventAnswerMutation,
} from '../redux/api/eventAnswerApi';
import AttachedFileList from './AttachedFileList';
import { IFile, INewFileObject } from '../ts/interfaces/IFile';
import EditableFileList from './EditableFileList';
import FileInput from './common/inputs/FileInput';
import PrimaryButton from './common/PrimaryButton';
import { ToastContainer, toast } from 'react-toastify';
import { useUploadFileMutation } from '../redux/api/fileApi';

interface EventAnswerProps {
  eventAnswerId?: number;
}

const EventAnswer: FC<EventAnswerProps> = ({ eventAnswerId }) => {
  const [eventAnswer, { data, isLoading, error }] =
    useLazyGetEventAnswerQuery();
  const [updateEventAnswer] = useUpdateEventAnswerMutation();
  const [uploadFile] = useUploadFileMutation();

  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования
  const [editedText, setEditedText] = useState('');
  const [attachedFilesList, setAttachedFilesList] = useState<IFile[]>([]);
  const [newFiles, setNewFiles] = useState<INewFileObject[]>([]);

  useEffect(() => {
    if (eventAnswerId) {
      eventAnswer(eventAnswerId);
    }
  }, []);

  useEffect(() => {
    if (data?.text) {
      setEditedText(data.text);
    }
    if (data?.files) {
      setAttachedFilesList(data.files);
    }
  }, [data]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(event.target.value);
  };

  const handleEditClick = async () => {
    if (!isEditing) {
      setIsEditing((prev) => !prev);
      return;
    }

    const fileIds: number[] = attachedFilesList
      ? attachedFilesList
          .filter((file) => file.id > 0)
          .map((file: IFile) => file.id)
      : [];

    let responseData;
    let responseError;

    if (eventAnswerId) {
      ({ data: responseData, error: responseError } = await updateEventAnswer({
        id: Number(eventAnswerId),
        text: editedText,
        fileIds: fileIds,
      }));

      if (responseError) {
        toast('Произошла серверная ошибка при сохранении изменений', {
          type: 'error',
        });
        return;
      }
    } else {
    }

    if (responseData) {
      // Загрузка файлов после успешного создания/обновления ответа
      const filesError = await uploadAllFiles(
        Number(responseData.id || eventAnswerId)
      );

      if (filesError === 0) {
      }
    }
    setIsEditing((prev) => !prev);
  };

  const handleFileDelete = (id: number) => {
    // Удаляем файл из массива для UI и массива с файлами (если файл новый)
    setAttachedFilesList((prev) => prev.filter((file) => file.id !== id));
    setNewFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleFilesChange = async (fileList: FileList | null) => {};

  const uploadAllFiles = async (intensiveId: number) => {
    let filesError = 0;

    if (newFiles.length === 0) return filesError;

    for (const newFile of newFiles) {
      // Показываем уведомление загрузки
      const toastId = toast.loading(`Загрузка файла: ${newFile.file.name}...`);

      const { error: responseError } = await uploadFile({
        context: 'event_answer',
        contextId: Number(intensiveId),
        files: newFile.file,
      });

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

  return (
    <div className="w-[100%] pt-5">
      {eventAnswerId || (!eventAnswerId && isEditing) ? (
        <>
          <textarea
            className="w-full p-3 border-2 border-solid rounded-md border-gray_3 focus:outline-none focus:ring-1 focus:ring-blue"
            value={editedText}
            onChange={handleTextChange}
            rows={4}
            disabled={!isEditing}
            placeholder="Введите текстовый ответ..."
          />

          {!isEditing ? (
            <AttachedFileList
              context={'event_answer'}
              contextId={eventAnswerId}
              nameFileList="ответа"
              files={attachedFilesList}
            />
          ) : (
            <div className="p-4 mx-auto my-3 bg-white rounded-lg shadow-md max-w">
              <EditableFileList
                files={attachedFilesList}
                nameFileList="ответа"
                onFileDelete={handleFileDelete}
              />
              <FileInput onFilesChange={handleFilesChange} />
            </div>
          )}
          <PrimaryButton
            type="button"
            children={
              isEditing
                ? eventAnswerId
                  ? 'Сохранить ответ'
                  : 'Сохранить и отправить'
                : eventAnswerId
                ? 'Редактировать ответ'
                : 'Отправить ответ'
            }
            clickHandler={() => handleEditClick()}
          />
        </>
      ) : (
        <>
          <PrimaryButton
            type="button"
            children={isEditing ? 'Сохранить и отправить' : 'Отправить ответ'}
            clickHandler={() => setIsEditing((prev) => !prev)}
          />
        </>
      )}
    </div>
  );
};

export default EventAnswer;
