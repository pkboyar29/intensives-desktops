import { FC, useState, useEffect, useRef } from 'react';
import { IFile } from '../ts/interfaces/IFile';
import { getISODateTimeInUTC3 } from '../helpers/dateHelpers';
import { formatFileSize } from '../helpers/fileHelpers';
import DownloadFileItem from './DownloadFileItem';

interface EditableFileListProps {
  files: IFile[];
  onFileDelete: (id: number) => void;
}

const EditableFileList: FC<EditableFileListProps> = ({
  files,
  onFileDelete,
}) => {
  return (
    <div className="max-w mx-auto bg-white rounded-lg pt-4 py-2">
      <h2 className="font-semibold mb-3">📂 Список файлов</h2>
      <div className="max-h-60 overflow-y-auto">
        {files.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md transition"
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
          <p className="text-gray-500 text-sm text-center py-4">
            Нет доступных файлов
          </p>
        )}
      </div>
    </div>
  );
};

export default EditableFileList;
