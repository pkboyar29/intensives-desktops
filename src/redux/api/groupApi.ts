import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IGroup,
  IGroupCreate,
  IGroupPatch,
  IGroupUpdate,
} from '../../ts/interfaces/IGroup';
import { mapFlow } from './flowApi';
import { mapProfile, mapSpecialization } from './educationApi';
import { baseQueryWithReauth, buildUrl } from './baseQuery';
import { childEntitiesMeta } from '../../ts/types/types';

export const mapGroup = (unmappedGroup: any): IGroup => {
  return {
    id: unmappedGroup.id,
    name: unmappedGroup.name,
    flow: mapFlow(unmappedGroup.flow),
    profile: unmappedGroup.profile && mapProfile(unmappedGroup.profile),
    specialization:
      unmappedGroup.specialization &&
      mapSpecialization(unmappedGroup.specialization),
  };
};
export const groupApi = createApi({
  reducerPath: 'groupApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getGroups: builder.query<
      {
        results: IGroup[];
        count: number;
        next: string | null;
        previous: string | null;
        childEntitiesMeta?: childEntitiesMeta[];
      },
      {
        flows?: number | null;
        withChildrenMeta?: boolean;
        limit?: number;
        offset?: number;
      }
    >({
      query: (args) => buildUrl('/groups', args),
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedGroup: any) =>
          mapGroup(unmappedGroup)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
        childEntitiesMeta: response.child_entities_meta,
      }),
    }),
    createGroup: builder.mutation<IGroup, IGroupCreate>({
      query: (data) => ({
        url: '/groups/',
        method: 'POST',
        body: {
          name: data.name,
        },
      }),
      transformResponse: (response: any): IGroup => mapGroup(response),
    }),
    updateGroup: builder.mutation<IGroup, IGroupPatch>({
      query: ({ id, ...patch }) => ({
        url: `/groups/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (response: any): IGroup => mapGroup(response),
    }),
    deleteGroup: builder.mutation<void, number>({
      query: (id) => ({
        url: `/groups/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupApi;
