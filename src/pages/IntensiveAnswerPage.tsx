import { FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../redux/store';
import { useLazyGetIntensiveAnswersQuery } from '../redux/api/intensiveAnswerApi';

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

const IntensiveAnswerPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);

  const [getIntensiveAnswers] = useLazyGetIntensiveAnswersQuery();

  const [intensiveAnswer, setIntensiveAnswer] =
    useState<IIntensiveAnswerMark>();
  const [editedTextAnswer, setEditedTextAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(true); // Состояние редактирования

  const {
    attachedFilesList,
    newFiles,
    handleFilesChange,
    setAttachedFilesList,
    setNewFiles,
    handleFileDelete,
  } = useFileHandler();

  useEffect(() => {
    const fetchIntensiveAnswers = async (teamId: number) => {
      const { data } = await getIntensiveAnswers({ teamId });

      if (data) {
        setIntensiveAnswer(data[0]);
      }
    };

    if (currentTeam) {
      fetchIntensiveAnswers(currentTeam.id);
    }
  }, [currentTeam]);

  const handleTextAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    if (validateKanban(value)) {
      setEditedTextAnswer(value);
    }
  };

  return (
    <>
      <Helmet>
        <title>{currentTeam && `Результат интенсива`}</title>
      </Helmet>

      <ToastContainer position="top-center" />
      <Title text="Мой результат интенсива" />
      <div className="mt-6 max-w">
        <div className="w-1/2 mt-3">
          <h1 className="mb-3 text-2xl font-semibold">Ответ на интенсив</h1>
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
              contextId={intensiveAnswer?.intensiveAnswer?.id}
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
          <PrimaryButton
            type="button"
            children={
              isEditing ? 'Сохранить и отправить' : 'Отправить новый ответ'
            }
            clickHandler={() => setIsEditing((prev) => !prev)}
          />
        </div>
        <div className="w-1/2 mt-3">
          <h1 className="mb-3 text-2xl font-semibold">Оценка за интенсив</h1>
          {intensiveAnswer?.intensiveMark ? (
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
