import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapTeamShort } from './teamApi';

import { IEducationRequest } from '../../ts/interfaces/IEducationRequest';

export const mapEducationRequest = (
  unmappedRequest: any
): IEducationRequest => {
  console.log(unmappedRequest);

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
    // TODO: добавить query параметр team для преподавателя
    getEducationRequests: builder.query<IEducationRequest[], number>({
      query: (intensiveId: number) =>
        `/education_requests/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): IEducationRequest[] =>
        response.map((unmappedRequest: any) =>
          mapEducationRequest(unmappedRequest)
        ),
    }),
  }),
});

export const { useLazyGetEducationRequestsQuery } = educationRequestApi;
