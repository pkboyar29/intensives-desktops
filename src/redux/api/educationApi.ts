import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IProfile,
  IProfileCreate,
  ISpecialization,
  ISpecializationCreate,
  ISpecializationPatch,
  IStageEducation,
  IStageEducationCreate,
} from '../../ts/interfaces/IEducation';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

export const mapStageEducation = (
  unmappedStageEducation: any
): IStageEducation => {
  return {
    id: unmappedStageEducation.id,
    name: unmappedStageEducation.name,
  };
};

export const mapProfile = (unmappedProfile: any): IProfile => {
  return {
    id: unmappedProfile.id,
    name: unmappedProfile.name,
  };
};

export const mapSpecialization = (
  unmappedSpecialization: any
): ISpecialization => {
  return {
    id: unmappedSpecialization.id,
    name: unmappedSpecialization.name,
    code: unmappedSpecialization.code,
  };
};

export const educationApi = createApi({
  reducerPath: 'educationApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEducation: builder.query<
      {
        results: IStageEducation[] | IProfile[] | ISpecialization[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        type?: 'stages_education' | 'profiles' | 'specializations'; //решить проблему при обязательности
        limit?: number;
        offset?: number;
      }
    >({
      query: ({ type, ...args }) => buildUrl(`/${type}`, args),
      transformResponse: (response: any, meta, arg) => ({
        results: response.results.map((unmapped: any) => {
          console.log(arg.type);
          switch (arg.type) {
            case 'stages_education':
              return mapStageEducation(unmapped);
            case 'profiles':
              return mapProfile(unmapped);
            case 'specializations':
              return mapSpecialization(unmapped);
          }
        }),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
    createEducation: builder.mutation<
      IStageEducation | IProfile | ISpecialization,
      {
        type?: 'stages_education' | 'profiles' | 'specializations';
        object: IStageEducationCreate | IProfileCreate | ISpecializationCreate;
      }
    >({
      query: (data) => ({
        url: '/buildings/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): ISpecialization =>
        mapSpecialization(response),
    }),
    updateEducation: builder.mutation<
      IStageEducation | IProfile | ISpecialization,
      {
        type?: 'stages_education' | 'profiles' | 'specializations';
        object: IStageEducationCreate | IProfileCreate | ISpecializationPatch;
      }
    >({
      query: (data) => ({
        url: `/${data.type}/`,
        method: 'PATCH',
        body: {
          name: data.object.name,
          //code: data.type === 'specializations' && data.object.code
        },
      }),
      transformResponse: (response: any): ISpecialization =>
        mapSpecialization(response),
    }),
    deleteEducation: builder.mutation<
      void,
      {
        type: 'stages_education' | 'profiles' | 'specializations';
        id: number; // Тоже решить
      }
    >({
      query: ({ type, id }) => ({
        url: `/${type}/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetEducationQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationApi;
