import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

import {
  IFlow,
  IFlowCreate,
  IFlowPatch,
  IFlowUpdate,
} from '../../ts/interfaces/IFlow';
import { childEntitiesMeta } from '../../ts/types/types';
import { mapUniversity } from './universityApi';
import { mapStageEducation } from './educationApi';

export const mapFlow = (unmappedFlow: any): IFlow => {
  return {
    id: unmappedFlow.id,
    name: unmappedFlow.name,
    university: mapUniversity(unmappedFlow.university),
    stageEducation: mapStageEducation(unmappedFlow.stage_education),
  };
};

export const flowApi = createApi({
  reducerPath: 'flowApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getFlows: builder.query<
      {
        results: IFlow[];
        count: number;
        next: string | null;
        previous: string | null;
        childEntitiesMeta?: childEntitiesMeta[];
      },
      {
        universities?: number | null;
        withChildrenMeta?: boolean;
        limit?: number;
        offset?: number;
      }
    >({
      query: (args) => buildUrl('/flows', args),
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedFlow: any) =>
          mapFlow(unmappedFlow)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
        childEntitiesMeta: response.child_entities_meta,
      }),
    }),
    createFlow: builder.mutation<IFlow, IFlowCreate>({
      query: (data) => ({
        url: '/flows/',
        method: 'POST',
        body: {
          name: data.name,
          university: data.university,
          stage_education: data.stageEducation,
        },
      }),
      transformResponse: (response: any): IFlow => mapFlow(response),
    }),
    updateFlow: builder.mutation<IFlow, IFlowPatch>({
      query: (data) => ({
        url: `/flows/${data.id}/`,
        method: 'PATCH',
        body: {
          name: data.name,
          university: data.university?.id,
          stage_education: data.stageEducation?.id,
        },
      }),
      transformResponse: (response: any): IFlow => mapFlow(response),
    }),
    deleteFlow: builder.mutation<void, number>({
      query: (id) => ({
        url: `/flows/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFlowsQuery,
  useLazyGetFlowsQuery,
  useCreateFlowMutation,
  useUpdateFlowMutation,
  useDeleteFlowMutation,
} = flowApi;
