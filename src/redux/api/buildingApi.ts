import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';
import {
  IUniversity,
  IUniversityCreate,
} from '../../ts/interfaces/IUniversity';
import { childEntitiesMeta } from '../../ts/types/types';
import {
  IBuilding,
  IBuildingCreate,
  IBuildingPatch,
} from '../../ts/interfaces/IBuilding';
import { mapUniversity } from './universityApi';

export const mapBuilding = (unmappedBuilding: any): IBuilding => {
  return {
    id: unmappedBuilding.id,
    name: unmappedBuilding.name,
    address: unmappedBuilding.address,
    university: mapUniversity(unmappedBuilding.university),
  };
};

export const buildingApi = createApi({
  reducerPath: 'buildingApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getBuildings: builder.query<
      {
        results: IBuilding[];
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
      query: (args) => buildUrl('/buildings', args),
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedBuilding: any) =>
          mapBuilding(unmappedBuilding)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
        childEntitiesMeta: response.child_entities_meta,
      }),
    }),
    createBuilding: builder.mutation<IBuilding, IBuildingCreate>({
      query: (data) => ({
        url: '/buildings/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): IBuilding => mapBuilding(response),
    }),
    updateBuilding: builder.mutation<IBuilding, IBuildingPatch>({
      query: ({ id, ...patch }) => ({
        url: `/buildings/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (response: any): IBuilding => mapBuilding(response),
    }),
    deleteBuilding: builder.mutation<void, number>({
      query: (id) => ({
        url: `/buildings/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetBuildingsQuery,
  useCreateBuildingMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
} = buildingApi;
