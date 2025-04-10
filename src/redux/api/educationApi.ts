import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IProfile,
  ISpecialization,
  IStageEducation,
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
  }),
});

export const { useLazyGetEducationQuery } = educationApi;
