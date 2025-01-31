import { FC, useState, useEffect, useRef } from 'react';
import { IFile } from '../ts/interfaces/IFile';
import { getISODateTimeInUTC3 } from '../helpers/dateHelpers';
import { formatSize } from '../helpers/fileHelpers';


interface AttachedFileListProps {
    files: IFile[];
    onFileClick: (id: number) => void;
}

const AttachedFileList: FC<AttachedFileListProps> = ({ files, onFileClick }) => {

    return(
    <div className="max-w mx-auto bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">📂 Список файлов</h2>
        <ul className="divide-y divide-gray-200">
            {files.length > 0 ? (
            files.map((file) => (
                <li
                key={file.id}
                onClick={() => onFileClick(file.id)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-md transition"
                >
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500">
                    {formatSize(file.size)} • {file.createdDt ? getISODateTimeInUTC3(file.createdDt) : "Неизвестная дата"}
                    </span>
                </div>
                </li>
            ))
            ) : (
            <p className="text-gray-500 text-sm text-center py-4">Нет доступных файлов</p>
            )}
        </ul>
    </div>       
    );
}

export default AttachedFileList;