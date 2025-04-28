import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';
import { TableType } from '../../tableConfigs';
import { IParent, IRelatedList } from '../../ts/interfaces/IRelatedList';
import { IBreadcrumb } from '../../ts/interfaces/IBreadcrumb';

export const mapBreadcrumb = (unmappedBreadcrumb: any): IBreadcrumb => {
  return {
    id: unmappedBreadcrumb.id,
    name: unmappedBreadcrumb.name,
    label: unmappedBreadcrumb.label,
  };
};

export const breadcrumbApi = createApi({
  reducerPath: 'breadcrumbApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getBreadcrumb: builder.query<
      {
        results: IBreadcrumb[];
      },
      {
        path: string;
      }
    >({
      query: ({ path }) => `/breadcrumbs/?path=${path}`,
      transformResponse: (response: any) => ({
        results: response.results.map(
          (unmappedRelatedList: any): IBreadcrumb =>
            mapBreadcrumb(unmappedRelatedList)
        ),
      }),
    }),
  }),
});

export const { useGetBreadcrumbQuery, useLazyGetBreadcrumbQuery } =
  breadcrumbApi;
