import { FC, useState, useEffect, useRef } from 'react';
import { IFile } from '../ts/interfaces/IFile';
import { getISODateTimeInUTC3 } from '../helpers/dateHelpers';
import { formatFileSize } from '../helpers/fileHelpers';
import DownloadFileItem from './DownloadFileItem';

interface AttachedFileListProps {
  context: string;
  contextId: number;
  files: IFile[];
  onFileClick: (id: number) => void;
}

const AttachedFileList: FC<AttachedFileListProps> = ({
  context,
  contextId,
  files,
  onFileClick,
}) => {
  return (
    <div className="max-w mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">📂 Список файлов</h2>
      <div className="max-h-60 overflow-y-auto">
        {' '}
        {/* Ограничение высоты и скролл */}
        <ul className="divide-y divide-gray-200">
          {files.length > 0 ? (
            files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md transition"
              >
                <DownloadFileItem
                  context={context}
                  contextId={contextId}
                  fileId={file.id}
                  filename={file.name}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)} •{' '}
                      {file.createdDt
                        ? getISODateTimeInUTC3(file.createdDt)
                        : 'Неизвестная дата'}
                    </span>
                  </div>
                </DownloadFileItem>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              Нет доступных файлов
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AttachedFileList;
