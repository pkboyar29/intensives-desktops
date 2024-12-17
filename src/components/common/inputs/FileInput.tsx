import { FC } from 'react';

const FileInput: FC = () => {
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
          className="block text-sm cursor-pointer text-gray_3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-bright_blue file:text-blue"
          multiple
        />
      </div>
    </div>
  );
};

export default FileInput;
