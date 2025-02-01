import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IFile, IDownloadFileParams } from '../../ts/interfaces/IFile';


export const mapFile = (unmappedFile: any): IFile => {
  return {
    id: unmappedFile.id,
    name: unmappedFile.name,
    size: unmappedFile.size,
    createdDt: unmappedFile.created_at
  };
};

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    downloadFile: builder.query<Blob, IDownloadFileParams>({
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
    uploadFile: builder.mutation<IFile[], File[]>({
      query: (data) => {
        const formData = new FormData();
        
        data.forEach((file) => formData.append('files', file));

        return {
          url: `/intensives/files/upload/`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any): IFile[] =>
        response.map((unmappedColumn: any) => mapFile(unmappedColumn)),
    }),
  }),
});

export const {
  useLazyDownloadFileQuery,
  useUploadFileMutation,
} = fileApi;
