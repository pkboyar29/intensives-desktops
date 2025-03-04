import { createApi } from '@reduxjs/toolkit/query';
import { baseQueryWithReauth } from './baseQuery';

import { IEventMark } from '../../ts/interfaces/IEventMark';

export const mapEventMark = () => {
  return;
};

export const eventMarkApi = createApi({
  reducerPath: 'eventMarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createEventMark: builder.mutation<void, void>({
      query: (data) => '',
    }),
  }),
});

// export const {
//    useCreateEventMarkMutation
//  } = eventMarkApi;
