import { FC, useState, useEffect, useRef } from 'react';
import { IFile } from '../ts/interfaces/IFile';
import { formatFileSize } from '../helpers/fileHelpers';
import DownloadFileItem from './DownloadFileItem';
import FileInput from './common/inputs/FileInput';

interface EditableFileListProps {
  files: IFile[];
  nameFileList?: string;
  onFilesChange: (files: File[] | null) => void;
  onFileDelete: (id: number) => void;
}

const EditableFileList: FC<EditableFileListProps> = ({
  files,
  nameFileList,
  onFilesChange,
  onFileDelete,
}) => {
  return (
    <div className="p-4 pt-2 mx-auto bg-white rounded-lg max-w">
      <h2 className="mb-3 text-lg font-semibold">{`📄 Список файлов ${
        nameFileList ? nameFileList : ''
      }`}</h2>
      <div className="overflow-y-scroll border rounded-xl max-h-60">
        {files.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between p-3 transition rounded-md hover:bg-gray-100"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onFileDelete(file.id)}
                  className="text-red hover:text-dark_red"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-sm text-center text-gray-500">Нет файлов</p>
        )}
      </div>
      <FileInput
        onFilesChange={onFilesChange}
        currentFilesCount={files.length}
      />
    </div>
  );
};

export default EditableFileList;
