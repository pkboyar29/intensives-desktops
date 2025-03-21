import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IFile,
  IDownloadFile,
  IUploadFile,
  IUploadFileContext,
} from '../../ts/interfaces/IFile';

export const mapFile = (unmappedFile: any): IFile => {
  return {
    id: unmappedFile.id,
    name: unmappedFile.name,
    size: unmappedFile.file_size,
    createdDt: unmappedFile.created_at,
  };
};

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    downloadFile: builder.query<Blob, IDownloadFile>({
      /**
       * Формируем URL вида:
       * /{context}/{contextId}/files/{fileId}/download
       * Например: /intensives/123/files/456/download
       */
      query: ({ context, contextId, fileId }) => ({
        url: `${context}/${contextId}/files/${fileId}/download`,
        method: 'GET',
        // Указываем, что нужно получить бинарные данные
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),
    uploadFiles: builder.mutation<IFile[], IUploadFileContext>({
      query: ({ context, contextId, files }) => {
        const formData = new FormData();

        if (Array.isArray(files)) {
          files.forEach((file) => formData.append('files', file));
        } else {
          formData.append('files', files);
        }

        return {
          url: `${context}/${contextId}/files/upload/`,
          method: 'PATCH',
          body: formData,
        };
      },
      transformResponse: (response: any): IFile[] =>
        response.map((unmappedFile: any) => mapFile(unmappedFile)),
    }),
  }),
});

export const { useLazyDownloadFileQuery, useUploadFilesMutation } = fileApi;
