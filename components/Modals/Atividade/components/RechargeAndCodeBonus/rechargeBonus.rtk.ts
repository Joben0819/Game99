import { REQUEST_METHOD } from '@/constants/enums';
import { Domain, dev_version, platform } from '@/services/api';
import { TDepositBonus, TRootResponse } from '@/services/response-type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const depositBonusApi = createApi({
  reducerPath: 'depositBonusApi',
  tagTypes: ['depositBonus'],
  baseQuery: fetchBaseQuery({
    baseUrl: Domain + platform + 'rechargeRewards/',
  }),
  endpoints: (build) => ({
    getDepositBonus: build.query({
      query: () => ({
        url: 'getDepositBonus',
        method: REQUEST_METHOD.POST,
        headers: {
          token: localStorage.getItem('token')?.toString(),
          'Accept-Language': localStorage.getItem('lang')?.toString(),
          dev: dev_version,
        },
      }),
      transformResponse: (response: TRootResponse<TDepositBonus>) => response.data,
      providesTags: ['depositBonus'],
    }),
    claimDepositBonus: build.mutation<TRootResponse<string>, void>({
      query: () => ({
        url: 'claimBonus',
        method: REQUEST_METHOD.POST,
        headers: {
          token: localStorage.getItem('token')?.toString(),
          'Accept-Language': localStorage.getItem('lang')?.toString(),
          dev: dev_version,
        },
      }),
      invalidatesTags: ['depositBonus'],
    }),
  }),
});

export const { useGetDepositBonusQuery, useClaimDepositBonusMutation } = depositBonusApi;
