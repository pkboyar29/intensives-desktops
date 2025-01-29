import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IFile } from '../../ts/interfaces/IFile';


export const mapFile = (unmappedFile: any): IFile => {
  return {
    id: unmappedFile.id,
    name: unmappedFile.name,
    size: unmappedFile.size,
    createdDt: unmappedFile.created_at
  };
};