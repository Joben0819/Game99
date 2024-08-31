import { REQUEST_METHOD } from '@/constants/enums';
import { Domain, dev_version, platform } from '@/services/api';
import { TRootResponse, TRouletteConfig } from '@/services/response-type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rouletteApi = createApi({
  reducerPath: 'rouletteApi',
  tagTypes: ['roulette'],
  baseQuery: fetchBaseQuery({
    baseUrl: Domain + platform + 'rechargeRewards/loginBonus/',
  }),
  endpoints: (build) => ({
    getRouletteConfig: build.query<TRouletteConfig, null>({
      query: () => ({
        url: 'config',
        method: REQUEST_METHOD.GET,
        headers: {
          token: localStorage.getItem('token')?.toString(),
          'Accept-Language': localStorage.getItem('lang')?.toString(),
          dev: dev_version,
        },
      }),
      transformResponse: (response: TRootResponse<TRouletteConfig>) => response.data,
      providesTags: ['roulette'],
    }),
    spinRoulette: build.mutation<TRootResponse<number>, void>({
      query: () => ({
        url: 'spin',
        method: REQUEST_METHOD.POST,
        headers: {
          token: localStorage.getItem('token')?.toString(),
          'Accept-Language': localStorage.getItem('lang')?.toString(),
          dev: dev_version,
        },
      }),
      invalidatesTags: ['roulette'],
    }),
  }),
});

export const { useGetRouletteConfigQuery, useSpinRouletteMutation } = rouletteApi;
