import { FC, useState, useEffect, useRef } from 'react';
import { IFile } from '../ts/interfaces/IFile';
import { getDateTimeDisplay } from '../helpers/dateHelpers';
import { formatFileSize } from '../helpers/fileHelpers';
import DownloadFileItem from './DownloadFileItem';

interface AttachedFileListProps {
  context: string;
  contextId?: number;
  files?: IFile[];
  nameFileList?: string;
  onFileClick?: (id: number) => void;
}

const AttachedFileList: FC<AttachedFileListProps> = ({
  context,
  contextId,
  files,
  nameFileList,
  onFileClick,
}) => {
  return (
    <div className="p-4 pt-2 mx-auto bg-white rounded-lg shadow-md max-w">
      <h2 className="mb-3 text-lg font-semibold">{`📄 Список файлов ${
        nameFileList ? nameFileList : ''
      }`}</h2>
      <div className="overflow-y-auto max-h-60">
        {' '}
        {/* Ограничение высоты и скролл */}
        <ul className="divide-y divide-gray-200">
          {files && contextId && files.length > 0 ? (
            files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between p-3 transition rounded-md hover:bg-gray-100"
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
                        ? getDateTimeDisplay(file.createdDt)
                        : 'Неизвестная дата'}
                    </span>
                  </div>
                </DownloadFileItem>
              </li>
            ))
          ) : (
            <p className="py-4 text-sm text-center text-gray-500">Нет файлов</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AttachedFileList;
