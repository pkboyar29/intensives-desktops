import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapTeamShort } from './teamApi';

import {
  IEducationRequest,
  IEducationRequestSend,
} from '../../ts/interfaces/IEducationRequest';

export const mapEducationRequest = (
  unmappedRequest: any
): IEducationRequest => {
  return {
    id: unmappedRequest.id,
    subject: unmappedRequest.subject,
    description: unmappedRequest.description,
    createdDate: new Date(unmappedRequest.created_at),
    status: unmappedRequest.status === 1 ? 'Открыт' : 'Закрыт',
    team: mapTeamShort(unmappedRequest.team),
  };
};

export const educationRequestApi = createApi({
  reducerPath: 'educationRequestApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getEducationRequests: builder.query<
      IEducationRequest[],
      { intensiveId: number; teamId: number | null }
    >({
      query: ({ intensiveId, teamId }) => {
        const searchParams = new URLSearchParams({
          intensive_id: intensiveId.toString(),
        });
        if (teamId) {
          searchParams.append('team_id', teamId.toString());
        }

        return `/education_requests/?${searchParams.toString()}`;
      },
      transformResponse: (response: any): IEducationRequest[] =>
        response.map((unmappedRequest: any) =>
          mapEducationRequest(unmappedRequest)
        ),
    }),
    sendEducationRequest: builder.mutation<
      IEducationRequest,
      IEducationRequestSend
    >({
      query: ({ intensiveId, ...data }) => ({
        url: `/education_requests/?intensive_id=${intensiveId}`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): IEducationRequest =>
        mapEducationRequest(response),
    }),
  }),
});

export const {
  useLazyGetEducationRequestsQuery,
  useSendEducationRequestMutation,
} = educationRequestApi;
