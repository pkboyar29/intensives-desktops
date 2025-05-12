import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';
import { TableType } from '../../tableConfigs';
import { IParent, IRelatedList } from '../../ts/interfaces/IRelatedList';

export const mapRelatedList = (unmappedRelatedList: any): IRelatedList => {
  return {
    id: unmappedRelatedList.id,
    name: unmappedRelatedList.name,
  };
};

export const mapParent = (unmappedParent: any): IParent => {
  console.log(unmappedParent);
  return {
    id: unmappedParent.id,
    name: unmappedParent.name,
    path: unmappedParent.url_path,
  };
};

export const relatedListApi = createApi({
  reducerPath: 'relatedListApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getRelatedList: builder.query<
      {
        results: IRelatedList[];
        parentInfo?: IParent;
        grandparentInfo?: IParent;
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        entity: string;
        entityId?: string | number;
        key: string;
        key_parent_id?: number | string;
        filter?: string;
        limit?: number;
        offset?: number;
      }
    >({
      query: ({ entity, entityId, ...args }) =>
        buildUrl(
          `/${entity}${entityId ? `/${entityId}` : ''}/related_list`,
          args
        ),
      transformResponse: (response: any) => ({
        results: response.results.map(
          (unmappedRelatedList: any): IRelatedList =>
            mapRelatedList(unmappedRelatedList)
        ),
        parentInfo: response.parent_info
          ? mapParent(response.parent_info)
          : undefined,
        grandparentInfo: response.grandparent_info
          ? mapParent(response.grandparent_info)
          : undefined,
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
  }),
});

export const { useGetRelatedListQuery, useLazyGetRelatedListQuery } =
  relatedListApi;
