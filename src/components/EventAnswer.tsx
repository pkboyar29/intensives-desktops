import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import {
  // useLazyGetEventAnswerQuery,
  useUpdateEventAnswerMutation,
  useCreateEventAnswerMutation,
  useDeleteEventAnswerMutation,
} from '../redux/api/eventAnswerApi';
import { useUploadFileMutation } from '../redux/api/fileApi';
import { validateKanban } from '../helpers/kanbanHelpers';
import { getDateTimeDisplay } from '../helpers/dateHelpers';
import {
  isUserManager,
  isUserTeacher,
  isUserStudent,
} from '../helpers/userHelpers';

import { IFile, INewFileObject } from '../ts/interfaces/IFile';
import { IEvent } from '../ts/interfaces/IEvent';
import { IEventAnswer } from '../ts/interfaces/IEventAnswer';

import TrashIcon from './icons/TrashIcon';
import Modal from './common/modals/Modal';
import EditableFileList from './EditableFileList';
import FileInput from './common/inputs/FileInput';
import PrimaryButton from './common/PrimaryButton';
import AttachedFileList from './AttachedFileList';
import { toast } from 'react-toastify';
import TeacherMarkCard from './TeacherMarkCard';
import EventMarkForm from './forms/EventMarkForm';
import { IEventMark } from '../ts/interfaces/IEventMark';
import { ICriteria } from '../ts/interfaces/ICriteria';

interface EventAnswerProps {
  // eventAnswerId?: number;
  eventAnswerData?: IEventAnswer;
  event: IEvent;
  onCreateAnswer?: (newEventAnswer: IEventAnswer) => void;
  onUpdateAnswer?: (newEventAnswer: IEventAnswer) => void;
  onDeleteAnswer?: (id: number) => void;
}

const EventAnswer: FC<EventAnswerProps> = ({
  // eventAnswerId,
  eventAnswerData,
  event,
  onCreateAnswer,
  onUpdateAnswer,
  onDeleteAnswer,
}) => {
  // const [getEventAnswer, { data, isLoading, error }] =
  //   useLazyGetEventAnswerQuery();
  // const [eventAnswer, setEventAnswer] = useState<IEventAnswer>();

  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  const [createEventAnswer] = useCreateEventAnswerMutation();
  const [updateEventAnswer] = useUpdateEventAnswerMutation();
  const [deleteEventAnswer] = useDeleteEventAnswerMutation();
  const [uploadFile] = useUploadFileMutation();

  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [editedText, setEditedText] = useState('');
  const [attachedFilesList, setAttachedFilesList] = useState<IFile[]>([]);
  const [newFiles, setNewFiles] = useState<INewFileObject[]>([]);

  const isUserJury =
    isUserTeacher(currentUser) &&
    event?.teachers.some((teacher) => teacher.id === currentUser?.teacherId);

  // useEffect(() => {
  //   if (eventAnswerId) {
  //     getEventAnswer(eventAnswerId);
  //   }
  // }, [eventAnswerId]);

  // useEffect(() => {
  //   setEventAnswer(data);

  //   if (data?.text) {
  //     setEditedText(data.text);
  //   }
  // }, [data]);

  useEffect(() => {
    if (eventAnswerData) {
      // setEventAnswer(eventAnswerData);
      setEditedText(eventAnswerData.text);
    }
  }, [eventAnswerData]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (validateKanban(value)) {
      //setEventAnswer((prev) => (prev ? { ...prev, text: value } : prev));
      setEditedText(value);
    }
  };

  const handleEditClick = async () => {
    if (!isEditing) {
      setIsEditing((prev) => !prev);
      return;
    }
    const fileIds: number[] = eventAnswerData?.files
      ? eventAnswerData?.files
          .filter((file) => file.id > 0)
          .map((file: IFile) => file.id)
      : [];

    let responseData;
    let responseError;

    if (eventAnswerData?.files.length == 0 && editedText.trim().length == 0) {
      toast('Должен быть текстовый ответ или файлы', {
        type: 'warning',
      });
      return;
    }

    if (eventAnswerData) {
      ({ data: responseData, error: responseError } = await updateEventAnswer({
        id: eventAnswerData.id,
        text: editedText,
        fileIds: fileIds,
      }));

      if (responseError) {
        toast('Произошла серверная ошибка при сохранении изменений', {
          type: 'error',
        });
        return;
      }

      toast('Ответ успешно изменен', {
        type: 'success',
      });
    } else {
      const { data: responseData, error: responseError } =
        await createEventAnswer({
          event: event.id,
          text: editedText,
        });

      if (responseError) {
        toast('Произошла серверная ошибка при отправке ответа', {
          type: 'error',
        });
        return;
      }

      if (onCreateAnswer && responseData) {
        onCreateAnswer(responseData);
      }
      toast('Ответ успешно отправлен', {
        type: 'success',
      });
    }

    // TODO: responseData никогда не заполняется тут
    if (responseData) {
      // Загрузка файлов после успешного создания/обновления ответа
      const filesError = await uploadAllFiles(
        Number(responseData.id || eventAnswerData?.id)
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
      {deleteModal && eventAnswerData && (
        <Modal
          title="Удаление ответа на мероприятие"
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
                    eventAnswerData?.id
                  );

                  setDeleteModal(false);

                  if (responseError) {
                    toast('Произошла серверная ошибка', { type: 'error' });
                    return;
                  }

                  if (onDeleteAnswer) {
                    onDeleteAnswer(eventAnswerData.id);
                  }

                  toast('Ответ успешно удален', {
                    type: 'success',
                  });
                }}
                children="Удалить"
              />
            </div>
          </div>
        </Modal>
      )}

      <div className="mt-5 max-w">
        {eventAnswerData || (!eventAnswerData && isEditing) ? (
          <>
            {eventAnswerData && (
              <p className="text-lg font-medium text-center">
                Ответ от {getDateTimeDisplay(eventAnswerData.createdDate)}
              </p>
            )}

            <textarea
              className="w-full p-3 text-base border-2 border-solid rounded-md border-gray_3 focus:outline-none focus:border-blue"
              value={editedText}
              onChange={handleTextChange}
              rows={4}
              disabled={!isEditing}
              placeholder="Введите текстовый ответ..."
            />

            {!isEditing ? (
              <AttachedFileList
                context={'event_answer'}
                contextId={eventAnswerData?.id}
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

            {/* опциональное отображение студентам */}
            {isUserStudent(currentUser) && (
              <>
                {/* если студент - тимлид */}
                {currentTeam?.teamlead?.id === currentUser?.studentId ? (
                  <>
                    {/* если ответа нету (он создается), то кнопки (разрешаем отправить) */}
                    {/* если ответ есть, но оценок нету, то кнопки (разрешаем редактировать) */}
                    {/* если есть ответ и он оценен, то отображаем оценки преподавателей */}
                    {!eventAnswerData || eventAnswerData.marks.length === 0 ? (
                      <div className="flex items-center gap-5 mt-2">
                        <PrimaryButton
                          type="button"
                          children={
                            isEditing
                              ? eventAnswerData
                                ? 'Сохранить ответ'
                                : 'Сохранить и отправить'
                              : eventAnswerData
                              ? 'Редактировать ответ'
                              : 'Отправить ответ'
                          }
                          clickHandler={handleEditClick}
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
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                <div className="mt-3">
                  {eventAnswerData?.marks &&
                    eventAnswerData.marks.length !== 0 && (
                      <>
                        <p className="text-lg text-center">Оценка на ответ</p>

                        {eventAnswerData.marks.map((mark, index) => {
                          if ('avgMark' in mark) {
                            return (
                              <div key={index}>
                                {mark.criteria?.name ? (
                                  <div>
                                    <p>Критерии и средняя оценка</p>
                                    <p>
                                      {mark.criteria.name} — {mark.avgMark}
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    {' '}
                                    <p>Средняя оценка: {mark.avgMark}</p>
                                  </>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </>
                    )}
                </div>
              </>
            )}

            {/* опциональное отображение преподавателям */}
            {isUserJury && eventAnswerData && (
              <EventMarkForm
                event={event}
                eventAnswerId={eventAnswerData.id}
                existingEventMarks={eventAnswerData.marks as IEventMark[]} // можно создать функцию type guard
                onChangeMarks={(updatedMarks) => {
                  if (eventAnswerData && onUpdateAnswer) {
                    onUpdateAnswer({
                      ...eventAnswerData,
                      hasMarks: true,
                      marks: updatedMarks,
                    });
                  }
                }}
              />
            )}

            {/* опциональное отображение организаторам */}
            {isUserManager(currentUser) && <>контент для организаторов</>}
          </>
        ) : (
          <PrimaryButton
            type="button"
            children={
              isEditing ? 'Сохранить и отправить' : 'Отправить новый ответ'
            }
            clickHandler={() => setIsEditing((prev) => !prev)}
          />
        )}
      </div>
    </>
  );
};

export default EventAnswer;
