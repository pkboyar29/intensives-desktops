import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';
import { TableType } from '../../tableConfigs';
import {
  IChildInfo,
  IKeyInfo,
  IParentInfo,
  IRelatedList,
  IRelatedListAdvanced,
  IRelatedListResult,
} from '../../ts/interfaces/IRelatedList';

export const mapRelatedListResults = (
  unmappedRelatedListResult: any
): IRelatedListResult => {
  return {
    id: unmappedRelatedListResult.id,
    name: unmappedRelatedListResult.name,
  };
};

export const mapParentInfo = (unmappedParentInfo: any): IParentInfo => {
  return {
    key: unmappedParentInfo.parent_key,
    name: unmappedParentInfo.parent_name,
  };
};

export const mapKeyInfo = (unmappedKeyInfo: any): IKeyInfo => {
  console.log(unmappedKeyInfo);
  return {
    name: unmappedKeyInfo.name,
    urlPath: unmappedKeyInfo.url_path,
  };
};

export const mapChildInfo = (unmappedChildInfo: any): IChildInfo => {
  return {
    key: unmappedChildInfo.child_key,
  };
};

export const mapRelatedList = (unmappedResult: any): IRelatedList => {
  return {
    results: unmappedResult.map((result: any) => mapRelatedListResults(result)),
  };
};

export const mapRelatedListAdvanced = (
  unmappedResult: any,
  unmappedKeyInfo: any,
  unmappedParentInfo: any,
  unmappedChildInfo: any
): IRelatedListAdvanced => {
  return {
    results: unmappedResult.map((result: any) => mapRelatedListResults(result)),
    keyInfo: mapKeyInfo(unmappedKeyInfo),
    parentInfo: unmappedParentInfo && mapParentInfo(unmappedParentInfo),
    childInfo: unmappedChildInfo && mapChildInfo(unmappedChildInfo),
  };
};

export const relatedListApi = createApi({
  reducerPath: 'relatedListApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getRelatedList: builder.query<
      {
        //results: IRelatedList[];
        relatedList: IRelatedList;
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
        //results: response.results.map(
        //  (unmappedRelatedList: any): IRelatedList =>
        //    mapRelatedList(unmappedRelatedList)
        //),
        relatedList: mapRelatedList(response.results),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
    getRelatedListAdvanced: builder.query<
      {
        //results: IRelatedList[];
        relatedListAdvanced: IRelatedListAdvanced;
        //keyInfo: IKeyInfo;
        //parentInfo?: IParentInfo;
        //childrenInfo?: String[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        entity: string;
        entityId?: string | number;
        type: 'parent' | 'children';
        key: string;
        filter?: string;
        limit?: number;
        offset?: number;
      }
    >({
      query: ({ entity, entityId, type, ...args }) =>
        buildUrl(
          `/${entity}${entityId ? `/${entityId}` : ''}/related_list/${type}`,
          args
        ),
      transformResponse: (response: any) => ({
        //results: response.results.map(
        //  (unmappedRelatedList: any): IRelatedList =>
        //    mapRelatedList(unmappedRelatedList)
        //),
        //keyInfo: mapKeyInfo(response.key_info),
        //parentInfo: response.parent_info
        //  ? mapParentInfo(response.parent_info)
        //  : undefined,
        //childrenInfo: response.children_info
        // ? response.children_info
        // : undefined,
        relatedListAdvanced: mapRelatedListAdvanced(
          response.results,
          response.key_info,
          response.parent_info,
          response.child_info
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
  }),
});

export const {
  useGetRelatedListQuery,
  useLazyGetRelatedListQuery,
  useGetRelatedListAdvancedQuery,
  useLazyGetRelatedListAdvancedQuery,
} = relatedListApi;
