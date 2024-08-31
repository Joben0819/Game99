import { REQUEST_METHOD } from '@/constants/enums';
import { Domain, dev_version, gameapp } from '@/services/api';
import { TJackpotPrize } from '@/services/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const prizePoolApi = createApi({
  reducerPath: 'prizePoolApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${Domain}${gameapp}` }),
  endpoints: (builder) => ({
    getJackpotPrizeList: builder.query<TJackpotPrize[], void>({
      query: (body) => ({
        url: 'getJackpotPrizeList',
        headers: {
          token: localStorage.getItem('token')?.toString(),
          dev: dev_version,
          'Accept-Language': localStorage.getItem('lang')?.toString(),
        },
        method: REQUEST_METHOD.POST,
        body,
      }),
      keepUnusedDataFor: 0.0001,
      transformResponse: (result: { data: TJackpotPrize[] | [] }) => {
        return result.data;
      },
    }),
  }),
});

export const { useGetJackpotPrizeListQuery } = prizePoolApi;
