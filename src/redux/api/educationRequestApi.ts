import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapTeamShort } from './teamApi';

import {
  IEducationRequest,
  IEducationRequestChangeStatus,
  IEducationRequestSend,
  IEducationRequestUpdate,
} from '../../ts/interfaces/IEducationRequest';
import { mapEducationRequestAnswer } from './educationRequestAnswerApi';

export const mapEducationRequest = (
  unmappedRequest: any
): IEducationRequest => {
  return {
    id: unmappedRequest.id,
    subject: unmappedRequest.subject,
    description: unmappedRequest.description,
    createdDate: new Date(unmappedRequest.created_at),
    updatedDate: new Date(unmappedRequest.updated_at),
    status: unmappedRequest.status === 'OPENED' ? 'Открыт' : 'Закрыт',
    team: mapTeamShort(unmappedRequest.team),
    answer: unmappedRequest.answer
      ? mapEducationRequestAnswer(unmappedRequest.answer)
      : null,
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
    updateEducationRequest: builder.mutation<
      IEducationRequest,
      IEducationRequestUpdate
    >({
      query: ({ requestId, ...data }) => ({
        url: `/education_requests/${requestId}/`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any): IEducationRequest =>
        mapEducationRequest(response),
    }),
    changeEducationRequestStatus: builder.mutation<
      void,
      IEducationRequestChangeStatus
    >({
      query: ({ status, requestId }) => ({
        url: `/education_requests/${requestId}/status/`,
        method: 'PATCH',
        body: { status: status },
      }),
    }),
    deleteEducationRequest: builder.mutation<void, number>({
      query: (requestId) => ({
        url: `/education_requests/${requestId}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetEducationRequestsQuery,
  useSendEducationRequestMutation,
  useUpdateEducationRequestMutation,
  useDeleteEducationRequestMutation,
  useChangeEducationRequestStatusMutation,
} = educationRequestApi;
