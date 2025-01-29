import { FC } from 'react';

interface FileInputProps {
  onFilesChange?: (files: FileList | null) => void;
}

const FileInput: FC<FileInputProps> = ({ onFilesChange }) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Получаем файлы из инпута
    if(onFilesChange) {
      onFilesChange(files); // Передаем файлы через колбэк
    }
  };

  return (
    <div>
      <div className="text-lg font-bold">Файлы для студентов</div>

      <div className="border-2 border-dashed border-gray_2 rounded-md p-4 text-gray_3 flex flex-col items-center justify-center h-[20vh] my-3">
        <label
          htmlFor="fileUpload"
          className="block mb-1 text-sm font-medium cursor-pointer"
        >
          Перетащите необходимые файлы
        </label>
        <input
          id="fileUpload"
          name="fileUpload"
          type="file"
          accept='.docx, .pdf'
          className="block text-sm cursor-pointer text-gray_3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-bright_blue file:text-blue"
          multiple
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileInput;
