import { FC } from 'react';

interface FileInputProps {
  currentFilesCount?: number;
  onFilesChange?: (files: File[] | null) => void;
}

const FileInput: FC<FileInputProps> = ({
  currentFilesCount = 0,
  onFilesChange,
}) => {
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILES = 10;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Получаем файлы из инпута
    if (!files) {
      return;
    }

    // Преобразуем в массив и фильтруем по размеру
    const validSizeFiles = Array.from(files).filter((file) => {
      return file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    });

    // Ограничиваем количество до MAX_FILES
    /*
    if(validSizeFiles.length > MAX_FILES - currentFilesCount) {
      validSizeFiles = validSizeFiles.slice(0, MAX_FILES - currentFilesCount);
    }
    */
    const limitedFiles = validSizeFiles.slice(0, MAX_FILES - currentFilesCount);

    if (onFilesChange) {
      onFilesChange(limitedFiles); // Передаем файлы через колбэк
    }

    // Очищаем значение инпута, чтобы убрать названия загруженных файлов
    event.target.value = '';
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray_2 rounded-md p-4 text-gray_3 flex flex-col items-center justify-center h-[20vh] my-3">
        <label
          htmlFor="fileUpload"
          className="block mb-1 text-sm font-medium cursor-pointer"
        >
          Перетащите необходимые файлы (не более 10 файлов до 10 МБ)
        </label>
        <input
          id="fileUpload"
          name="fileUpload"
          type="file"
          accept=""
          className="block text-sm cursor-pointer text-gray_3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-bright_blue file:text-blue"
          multiple
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileInput;
