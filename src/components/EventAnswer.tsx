import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import {
  useUpdateEventAnswerMutation,
  useCreateEventAnswerMutation,
  useDeleteEventAnswerMutation,
} from '../redux/api/eventAnswerApi';
import { useUploadFilesMutation } from '../redux/api/fileApi';
import { validateKanban } from '../helpers/kanbanHelpers';
import { getDateTimeDisplay } from '../helpers/dateHelpers';
import {
  isUserManager,
  isUserTeacher,
  isUserStudent,
  isUserTeamlead,
  isUserTutor,
  isUserMentor,
  isUserJury,
} from '../helpers/userHelpers';
import { useFileHandler } from '../helpers/useFileHandler';
import { uploadAllFiles } from '../helpers/fileHelpers';

import TrashIcon from './icons/TrashIcon';
import Modal from './common/modals/Modal';
import EditableFileList from './EditableFileList';
import FileInput from './common/inputs/FileInput';
import PrimaryButton from './common/PrimaryButton';
import AttachedFileList from './AttachedFileList';
import { toast } from 'react-toastify';
import TeacherMarkCard from './TeacherMarkCard';
import EventMarkForm from './forms/EventMarkForm';

import { IFile, INewFileObject } from '../ts/interfaces/IFile';
import { IEvent } from '../ts/interfaces/IEvent';
import { IEventAnswer } from '../ts/interfaces/IEventAnswer';
import { IEventMark } from '../ts/interfaces/IEventMark';
import { ICriteria } from '../ts/interfaces/ICriteria';

interface EventAnswerProps {
  eventAnswerData?: IEventAnswer;
  event: IEvent;
  onCreateAnswer?: (newEventAnswer: IEventAnswer) => void;
  onUpdateAnswer?: (newEventAnswer: IEventAnswer) => void;
  onDeleteAnswer?: (id: number) => void;
}

const EventAnswer: FC<EventAnswerProps> = ({
  eventAnswerData,
  event,
  onCreateAnswer,
  onUpdateAnswer,
  onDeleteAnswer,
}) => {
  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  const [createEventAnswer] = useCreateEventAnswerMutation();
  const [updateEventAnswer] = useUpdateEventAnswerMutation();
  const [deleteEventAnswer] = useDeleteEventAnswerMutation();
  const [uploadFiles] = useUploadFilesMutation();

  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [editedText, setEditedText] = useState('');
  const {
    attachedFilesList,
    newFiles,
    handleFilesChange,
    setAttachedFilesList,
    setNewFiles,
    handleFileDelete,
  } = useFileHandler();

  useEffect(() => {
    if (eventAnswerData) {
      setEditedText(eventAnswerData.text);

      if (attachedFilesList.length === 0) {
        setAttachedFilesList((prevFiles) => [
          ...prevFiles,
          ...eventAnswerData.files,
        ]);
      }
    }
  }, [eventAnswerData]);

  const marksByTeacher = () => {
    const _marksByTeacher = eventAnswerData?.marks.reduce<
      Record<number, IEventMark[]>
    >((acc, mark) => {
      const teacherId = (mark as IEventMark).teacher.id;
      if (!acc[teacherId]) {
        acc[teacherId] = [];
      }
      acc[teacherId].push(mark as IEventMark);
      return acc;
    }, {});

    return _marksByTeacher;
  };

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
    const fileIds: number[] = attachedFilesList
      ? attachedFilesList
          .filter((file) => file.id > 0)
          .map((file: IFile) => file.id)
      : [];

    let responseData;
    let responseError;

    if (attachedFilesList.length == 0 && editedText.trim().length == 0) {
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
      ({ data: responseData, error: responseError } = await createEventAnswer({
        event: event.id,
        text: editedText,
      }));

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

    if (responseData && newFiles.length > 0) {
      console.log('upload files');
      // Загрузка файлов после успешного создания/обновления ответа
      const { success, errors } = await uploadAllFiles(
        uploadFiles,
        'event_answers',
        Number(responseData.id || eventAnswerData?.id),
        newFiles
      );
      console.log(success);

      if (success) {
        setAttachedFilesList(attachedFilesList.filter((file) => file.id > 0)); // удаляем временные значения с отрицательным id (может перенести в хук)

        setAttachedFilesList((prev) => [...prev, ...success]); // записываем пришедшие данные о файлах
      }
      if (errors !== 0) {
        // че то делать или ничего если ошибки
      }
    }
    setIsEditing((prev) => !prev);
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
                context={'event_answers'}
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

            {/* опциональное отображение студентам/тьютору/наставнику команды */}
            {(isUserStudent(currentUser) ||
              isUserTutor(currentUser, currentTeam) ||
              isUserMentor(currentUser)) && (
              <>
                {/* если студент - тимлид, то отображаем  */}
                {isUserTeamlead(currentUser, currentTeam) && (
                  <>
                    {/* если ответа нету (он создается), то кнопки (разрешаем отправить) */}
                    {/* если ответ есть, но оценок нету, то кнопки (разрешаем редактировать) */}
                    {/* если есть ответ и он оценен, то отображаем оценки преподавателей */}
                    {(!eventAnswerData ||
                      eventAnswerData.marks.length === 0) && (
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
                    )}
                  </>
                )}

                <div className="mt-3">
                  {eventAnswerData?.marks &&
                    eventAnswerData.marks.length !== 0 && (
                      <>
                        <p className="text-lg text-center">Оценка на ответ</p>
                        <div className="mt-2 space-y-2 transition-transform transform bg-white"></div>
                        {eventAnswerData.marks.map((mark, index) => {
                          if ('avgMark' in mark) {
                            return (
                              <div
                                key={index}
                                className="p-4 transition-transform transform bg-white border border-gray-200 rounded-xl"
                              >
                                {mark.criteria?.name ? (
                                  <div>
                                    <p className="p-1">
                                      {mark.criteria.name} —{' '}
                                      <span className="font-bold text-green-600">
                                        {mark.avgMark}
                                      </span>
                                    </p>
                                  </div>
                                ) : (
                                  <p className="p-1 text-lg font-medium">
                                    Средняя оценка —{' '}
                                    <span className="text-green-600">
                                      {mark.avgMark}
                                    </span>
                                  </p>
                                )}
                              </div>
                            );
                          }
                          // TODO: что за return null?
                          return null;
                        })}{' '}
                      </>
                    )}
                </div>
              </>
            )}

            {/* опциональное отображение преподавателям жюри */}
            {isUserJury(currentUser, event) && eventAnswerData && (
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

            {isUserManager(currentUser) &&
              (() => {
                const teacherMarksData = marksByTeacher();
                return (
                  teacherMarksData && (
                    <div className="flex flex-col gap-2">
                      {Object.entries(marksByTeacher).map(
                        ([teacherId, teacherMarks]) => (
                          <TeacherMarkCard
                            key={teacherId}
                            teacherMarks={teacherMarks}
                            markStrategy={event.markStrategy!}
                          />
                        )
                      )}
                    </div>
                  )
                );
              })()}
          </>
        ) : (
          isUserTeamlead(currentUser, currentTeam) && (
            <PrimaryButton
              type="button"
              children={
                isEditing ? 'Сохранить и отправить' : 'Отправить новый ответ'
              }
              clickHandler={() => setIsEditing((prev) => !prev)}
            />
          )
        )}
      </div>
    </>
  );
};

export default EventAnswer;
