import { FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../redux/store';
import {
  useCreateIntensiveAnswerMutation,
  useLazyGetIntensiveAnswersQuery,
} from '../redux/api/intensiveAnswerApi';

import Skeleton from 'react-loading-skeleton';
import { Helmet } from 'react-helmet-async';
import Title from '../components/common/Title';
import { ToastContainer, toast } from 'react-toastify';

import { IIntensiveAnswerMark } from '../ts/interfaces/IIntensiveAnswer';
import IntensiveMarkForm from '../components/forms/IntensiveMarkForm';
import { validateKanban } from '../helpers/kanbanHelpers';
import AttachedFileList from '../components/AttachedFileList';
import EditableFileList from '../components/EditableFileList';
import { useFileHandler } from '../helpers/useFileHandler';
import FileInput from '../components/common/inputs/FileInput';
import PrimaryButton from '../components/common/PrimaryButton';
import {
  getDateTimeDisplay,
  getISODateTimeInUTC3,
} from '../helpers/dateHelpers';

const IntensiveAnswerPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [getIntensiveAnswers] = useLazyGetIntensiveAnswersQuery();
  const [createIntensiveAnswer] = useCreateIntensiveAnswerMutation();

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

    if (!intensiveAnswerMark?.intensiveAnswer) {
      const { data: createAnswerData, error: createAnswerError } =
        await createIntensiveAnswer({
          text: editedTextAnswer,
          intensiveId: currentIntensive.id,
        });

      console.log(createAnswerData);
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
          {!intensiveAnswerMark?.intensiveAnswer && !isEditing && (
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
              {intensiveAnswerMark?.intensiveAnswer && (
                <div className="mt-2">
                  <p className="py-2">
                    {' '}
                    Ответ отправлен{' - '}
                    {getDateTimeDisplay(
                      intensiveAnswerMark?.intensiveAnswer.createdDate
                    )}
                  </p>
                  {intensiveAnswerMark?.intensiveAnswer?.updatedDate && (
                    <p className="py-2">
                      {' '}
                      Ответ изменен{' - '}
                      {getDateTimeDisplay(
                        intensiveAnswerMark?.intensiveAnswer.createdDate
                      )}
                    </p>
                  )}
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
                  console.log('answer');
                  sendAnswer();
                }
                setIsEditing((prev) => !prev);
              }}
            />
          </div>
        </div>
        <div className="w-1/2 mt-8">
          <h1 className="mb-3 text-2xl font-semibold">Оценка за интенсив</h1>
          {intensiveAnswerMark?.intensiveMark ? (
            <></>
          ) : (
            <p className="text-xl">Оценки пока нет</p>
          )}
        </div>
      </div>
    </>
  );
};

export default IntensiveAnswerPage;
