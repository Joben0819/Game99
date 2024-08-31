import { REQUEST_METHOD } from '@/constants/enums';
import { Domain, dev_version, gameapp } from '@/services/api';
import { TJackpotPrizeList, TRootResponse } from '@/services/response-type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jackpotPrizeListApi = createApi({
  reducerPath: 'jackpotPrizeListApi',
  tagTypes: ['jackpot'],
  baseQuery: fetchBaseQuery({
    baseUrl: Domain + gameapp,
  }),
  endpoints: (build) => ({
    getJackpotPrizeList: build.query<TJackpotPrizeList[], null>({
      query: () => ({
        url: 'getJackpotPrizeList',
        method: REQUEST_METHOD.POST,
        headers: {
          token: localStorage.getItem('token')?.toString(),
          'Accept-Language': localStorage.getItem('lang')?.toString(),
          dev: dev_version,
        },
      }),
      transformResponse: (response: TRootResponse<TJackpotPrizeList[]>) => response.data,
    }),
  }),
});

export const { useGetJackpotPrizeListQuery } = jackpotPrizeListApi;
