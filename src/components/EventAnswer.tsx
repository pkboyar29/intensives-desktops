import { FC, useState, useEffect } from 'react';
import { useLazyGetEventAnswerQuery } from '../redux/api/eventAnswerApi';
import AttachedFileList from './AttachedFileList';
import { IFile, INewFileObject } from '../ts/interfaces/IFile';
import EditableFileList from './EditableFileList';
import FileInput from './common/inputs/FileInput';
import PrimaryButton from './common/PrimaryButton';

interface EventAnswerProps {
  eventAnswerId?: number;
}

const EventAnswer: FC<EventAnswerProps> = ({ eventAnswerId }) => {
  const [eventAnswer, { data, isLoading, error }] =
    useLazyGetEventAnswerQuery();

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

  const handleEditClick = () => {
    if (isEditing) {
      console.log('Сохранить изменения:', editedText);
    }
    setIsEditing((prev) => !prev);
  };

  const handleFileDelete = (id: number) => {
    // Удаляем файл из массива для UI и массива с файлами (если файл новый)
    setAttachedFilesList((prev) => prev.filter((file) => file.id !== id));
    setNewFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleFilesChange = async (fileList: FileList | null) => {};
  return (
    <div className="w-[100%] pt-5">
      <p className="mb-3 text-xl font-bold text-black_2">
        {eventAnswerId
          ? 'Ответ на мероприятие'
          : 'Ответ на мероприятие не отправлен'}
      </p>
      {eventAnswerId || (!eventAnswerId && isEditing) ? (
        <>
          <textarea
            className="w-full p-3 border-2 rounded-md border-gray_3 focus:outline-none focus:ring-1 focus:ring-blue"
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
