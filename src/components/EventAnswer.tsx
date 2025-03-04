import { FC, useState, useEffect } from 'react';
import {
  useLazyGetEventAnswerQuery,
  useUpdateEventAnswerMutation,
  useCreateEventAnswerMutation,
  useDeleteEventAnswerMutation,
} from '../redux/api/eventAnswerApi';
import { useUploadFileMutation } from '../redux/api/fileApi';
// TODO: что за validateKandan использующийся в компоненте EventAnswer?
import { validateKanban } from '../helpers/kanbanHelpers';
import { getISODateTimeInUTC3 } from '../helpers/dateHelpers';

import { IFile, INewFileObject } from '../ts/interfaces/IFile';
import { IEventAnswer } from '../ts/interfaces/IEventAnswer';

import BackToScheduleButton from './BackToScheduleButton';
import TrashIcon from './icons/TrashIcon';
import Modal from './common/modals/Modal';
import EditableFileList from './EditableFileList';
import FileInput from './common/inputs/FileInput';
import PrimaryButton from './common/PrimaryButton';
import AttachedFileList from './AttachedFileList';
import { ToastContainer, toast } from 'react-toastify';

interface EventAnswerProps {
  eventAnswerId?: number;
  eventId?: number;
  hasMarks?: boolean; //Временно
}

const EventAnswer: FC<EventAnswerProps> = ({
  eventAnswerId,
  eventId,
  hasMarks,
}) => {
  const [getEventAnswer, { data, isLoading, error }] =
    useLazyGetEventAnswerQuery();
  const [updateEventAnswer] = useUpdateEventAnswerMutation();
  const [createEventAnswer] = useCreateEventAnswerMutation();
  const [deleteEventAnswer] = useDeleteEventAnswerMutation();
  const [uploadFile] = useUploadFileMutation();

  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования
  const [eventAnswer, setEventAnswer] = useState<IEventAnswer>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [editedText, setEditedText] = useState('');
  const [attachedFilesList, setAttachedFilesList] = useState<IFile[]>([]);
  const [newFiles, setNewFiles] = useState<INewFileObject[]>([]);

  useEffect(() => {
    if (eventAnswerId) {
      getEventAnswer(eventAnswerId);
    }
  }, [eventAnswerId]);

  useEffect(() => {
    if (data?.text) {
      setEditedText(data.text);
    }
    if (data?.files) {
      setAttachedFilesList(data.files);
    }
    setEventAnswer(data);
  }, [data]);

  useEffect(() => {
    console.log(eventAnswer);
  }, [eventAnswer]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (validateKanban(value)) {
      setEditedText(value);
    }
  };

  const handleEditClick = async () => {
    if (!isEditing) {
      setIsEditing((prev) => !prev);
      return;
    }
    const fileIds: number[] = eventAnswer?.files
      ? eventAnswer?.files
          .filter((file) => file.id > 0)
          .map((file: IFile) => file.id)
      : [];

    let responseData;
    let responseError;

    if (fileIds.length == 0 && editedText.trim().length == 0) {
      toast('Должен быть текстовый ответ или файлы', {
        type: 'warning',
      });
      return;
    }

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
    } else if (eventId) {
      ({ data: responseData, error: responseError } = await createEventAnswer({
        event: eventId,
        text: editedText,
      }));

      if (responseError) {
        toast('Произошла серверная ошибка при отправке ответа', {
          type: 'error',
        });
        return;
      }

      toast('Ответ успешно отправлен', {
        type: 'success',
      });
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
    <>
      {deleteModal && eventAnswerId && (
        <Modal
          title="Удаление интенсива"
          onCloseModal={() => setDeleteModal(false)}
        >
          <p className="text-lg text-bright_gray">
            {`Вы уверены, что хотите удалить ответ?`}
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => setDeleteModal(false)}
                children="Отмена"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={async () => {
                  const { error: responseError } = await deleteEventAnswer(
                    eventAnswerId
                  );
                  toast('Ответ успешно удален', {
                    type: 'success',
                  });
                  setDeleteModal(false);

                  if (responseError) {
                    toast('Произошла серверная ошибка', { type: 'error' });
                  }
                }}
                children="Удалить"
              />
            </div>
          </div>
        </Modal>
      )}
      <div className="mt-5 max-w">
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
              <div className="mx-auto my-3 bg-white rounded-lg shadow-md max-w">
                <EditableFileList
                  files={attachedFilesList}
                  nameFileList="ответа"
                  onFileDelete={handleFileDelete}
                />
                <FileInput onFilesChange={handleFilesChange} />
              </div>
            )}
            {!hasMarks ? (
              <div className="flex items-center gap-5 mt-2">
                <BackToScheduleButton />

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
                <div>
                  <PrimaryButton
                    buttonColor="gray"
                    children={<TrashIcon />}
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-3">Область с оценками преподавателей</div>
            )}
          </>
        ) : (
          <div className="flex gap-7">
            <BackToScheduleButton />

            <PrimaryButton
              type="button"
              children={
                isEditing ? 'Сохранить и отправить' : 'Отправить новый ответ'
              }
              clickHandler={() => setIsEditing((prev) => !prev)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EventAnswer;
