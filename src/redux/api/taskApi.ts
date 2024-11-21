import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';


export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        
    }),
});