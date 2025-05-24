import { FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../redux/store';
import {
  useCreateIntensiveAnswerMutation,
  useLazyGetIntensiveAnswersQuery,
  useUpdateInstensiveAnswerMutation,
} from '../redux/api/intensiveAnswerApi';

import Skeleton from 'react-loading-skeleton';
import { Helmet } from 'react-helmet-async';
import Title from '../components/common/Title';
import { ToastContainer, toast } from 'react-toastify';

import { IIntensiveAnswerMark } from '../ts/interfaces/IIntensiveAnswer';
import { validateKanban } from '../helpers/kanbanHelpers';
import AttachedFileList from '../components/AttachedFileList';
import EditableFileList from '../components/EditableFileList';
import { useFileHandler } from '../helpers/useFileHandler';
import FileInput from '../components/common/inputs/FileInput';
import PrimaryButton from '../components/common/PrimaryButton';
import { getDateTimeDisplay } from '../helpers/dateHelpers';
import { IFile } from '../ts/interfaces/IFile';
import { uploadAllFiles } from '../helpers/fileHelpers';
import { useUploadFilesMutation } from '../redux/api/fileApi';

const IntensiveAnswerPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [getIntensiveAnswers] = useLazyGetIntensiveAnswersQuery();
  const [createIntensiveAnswer] = useCreateIntensiveAnswerMutation();
  const [updateIntensiveAnswer] = useUpdateInstensiveAnswerMutation();
  const [uploadFiles] = useUploadFilesMutation();

  const [intensiveAnswerMark, setIntensiveAnswerMark] =
    useState<IIntensiveAnswerMark>();
  const [editedTextAnswer, setEditedTextAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования

  const {
    attachedFilesList,
    newFiles,
    handleFilesChange,
    setAttachedFilesList,
    setNewFiles,
    handleFileDelete,
  } = useFileHandler();

  useEffect(() => {
    if (currentIntensive) {
      loadIntensiveAnswer(currentIntensive.id);
    }
  }, [currentIntensive]);

  const loadIntensiveAnswer = async (intensiveId: number) => {
    const { data } = await getIntensiveAnswers({ intensive_id: intensiveId });

    if (data) {
      setIntensiveAnswerMark(data[0]);
      console.log(data[0].intensiveMark);
      if (data[0].intensiveAnswer) {
        setEditedTextAnswer(data[0].intensiveAnswer.text);
        setAttachedFilesList(data[0].intensiveAnswer.files);
        //setIsEditing(false);
      }
    }
  };

  const handleTextAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    if (validateKanban(value)) {
      setEditedTextAnswer(value);
    }
  };

  const sendAnswer = async () => {
    if (!currentIntensive) return;

    if (attachedFilesList.length == 0 && editedTextAnswer.trim().length == 0) {
      toast('Должен быть текстовый ответ или файлы', {
        type: 'warning',
      });
      return;
    }

    let responseData;
    let responseError;
    let intensiveAnswerId;

    const fileIds: number[] = attachedFilesList
      ? attachedFilesList
          .filter((file) => file.id > 0)
          .map((file: IFile) => file.id)
      : [];

    if (intensiveAnswerMark?.intensiveAnswer) {
      ({ data: responseData, error: responseError } =
        await updateIntensiveAnswer({
          id: intensiveAnswerMark.intensiveAnswer.id,
          text: editedTextAnswer,
          fileIds,
        }));

      if (responseError) {
        toast('Произошла серверная ошибка при сохранении изменений', {
          type: 'error',
        });
        return;
      }

      //loadIntensiveAnswer(currentIntensive.id);
      toast('Ответ успешно изменен', {
        type: 'success',
      });
      intensiveAnswerId = intensiveAnswerMark.intensiveAnswer.id;
    } else {
      ({ data: responseData, error: responseError } =
        await createIntensiveAnswer({
          text: editedTextAnswer,
          intensiveId: currentIntensive.id,
        }));

      if (responseError) {
        toast('Произошла серверная ошибка при отправке ответа', {
          type: 'error',
        });
        return;
      }

      if (responseData) {
        //loadIntensiveAnswer(currentIntensive.id);
        toast('Ответ успешно отправлен', {
          type: 'success',
        });

        intensiveAnswerId = responseData.id;
      }
    }

    if (responseData) {
      // Загрузка файлов после успешного создания/обновления ответа если файлы прикреплены
      if (newFiles.length > 0) {
        const { success, errors } = await uploadAllFiles(
          uploadFiles,
          'intensive_answers',
          Number(intensiveAnswerId),
          newFiles
        );

        setNewFiles([]); // очистка состояния с файлами
        if (errors !== 0) {
          // че то делать или ничего если ошибки
        }
      }

      // "Обновление" состояния
      loadIntensiveAnswer(currentIntensive.id);
    }
  };

  return (
    <>
      <Helmet>
        <title>{currentTeam && `Результат интенсива`}</title>
      </Helmet>

      <ToastContainer position="top-center" />
      <Title text="Мой результат интенсива" />
      <div className="mt-8 max-w">
        <div className="mt-3 lg:w-1/2">
          <h1 className="mb-3 text-2xl font-semibold">Ответ на интенсив</h1>
          {!intensiveAnswerMark ? (
            <Skeleton />
          ) : (
            <>
              {!intensiveAnswerMark.intensiveAnswer && !isEditing && (
                <p className="mb-5 text-xl">Ответ не отправлен</p>
              )}
              {(intensiveAnswerMark?.intensiveAnswer || isEditing) && (
                <>
                  <textarea
                    className="w-full p-3 text-base border-2 border-solid rounded-md shadow-md border-gray_3 focus:outline-none focus:border-blue"
                    value={editedTextAnswer}
                    onChange={handleTextAnswerChange}
                    rows={4}
                    disabled={!isEditing}
                    placeholder="Введите текстовый ответ..."
                  />

                  {!isEditing ? (
                    <AttachedFileList
                      context={'intensive_answers'}
                      contextId={intensiveAnswerMark?.intensiveAnswer?.id}
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
                  {intensiveAnswerMark?.intensiveAnswer?.updatedDate && (
                    <div className="mt-1">
                      <p className="py-2 text-lg">
                        {' '}
                        Ответ отправлен(обновлен){' - '}
                        {getDateTimeDisplay(
                          intensiveAnswerMark?.intensiveAnswer.updatedDate
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
              <div className="flex mt-3 space-x-5">
                {isEditing && (
                  <PrimaryButton
                    type="button"
                    buttonColor={'red'}
                    children={'Отменить'}
                    clickHandler={() => setIsEditing(false)}
                  />
                )}
                <PrimaryButton
                  type="button"
                  //buttonColor={isEditing ? 'red' : 'blue'}
                  children={
                    isEditing
                      ? intensiveAnswerMark?.intensiveAnswer
                        ? 'Сохранить ответ'
                        : 'Сохранить и отправить'
                      : intensiveAnswerMark?.intensiveAnswer
                      ? 'Редактировать ответ'
                      : 'Отправить ответ'
                  }
                  clickHandler={() => {
                    if (isEditing) {
                      sendAnswer();
                    }
                    setIsEditing((prev) => !prev);
                  }}
                />
              </div>
            </>
          )}
        </div>
        <div className="w-1/2 mt-8">
          <h1 className="mb-3 text-2xl font-semibold">Оценка за интенсив</h1>
          {!intensiveAnswerMark?.intensiveMark && (
            <p className="text-xl">Оценки пока нет</p>
          )}

          {intensiveAnswerMark?.intensiveMark && (
            <div className="p-1 space-y-1 text-lg">
              <p className="">
                Преподаватель — {intensiveAnswerMark.intensiveMark.teacher.name}
              </p>
              <p className="font-medium">
                Оценка —{' '}
                <span className="text-green-600">
                  {intensiveAnswerMark.intensiveMark.mark}
                </span>
              </p>
              <p>
                Выставлена(обновлена){' — '}
                {getDateTimeDisplay(
                  intensiveAnswerMark.intensiveMark.updatedDate
                )}
              </p>
              <p>Комментарий — "{intensiveAnswerMark.intensiveMark.comment}"</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IntensiveAnswerPage;
