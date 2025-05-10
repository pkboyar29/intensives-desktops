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
    flow: unmappedGroup.flow && mapFlow(unmappedGroup.flow),
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
        flow?: number | null;
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
          flow: data.flow,
          profile: data.profile,
          specialization: data.specialization,
        },
      }),
      transformResponse: (response: any): IGroup => mapGroup(response),
    }),
    updateGroup: builder.mutation<IGroup, IGroupPatch>({
      query: (data) => ({
        url: `/groups/${data.id}/`,
        method: 'PATCH',
        body: {
          name: data.name,
          flow: data.flow?.id,
          profile: data.profile?.id,
          specialization: data.specialization?.id,
        },
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
