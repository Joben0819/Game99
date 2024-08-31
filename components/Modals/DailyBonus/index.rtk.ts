import { REQUEST_METHOD } from '@/constants/enums';
import { Domain, dev_version, platform } from '@/services/api';
import { TVipGiftInfo } from '@/services/response-type';
import { TCollectBonusBonus, TMemberBonusRewards, TMemberBonusRewardsConfig } from '@/services/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dailyBonusApi = createApi({
  reducerPath: 'dailyBonusApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${Domain}${platform}` }),
  tagTypes: ['daily_bonus'],
  endpoints: (builder) => ({
    getVipGiftInfo: builder.query<TVipGiftInfo, string>({
      query: (body) => ({
        url: 'getVipGiftInfo',
        headers: {
          token: localStorage.getItem('token')?.toString(),
          dev: dev_version,
          'Accept-Language': localStorage.getItem('lang')?.toString(),
        },
        method: REQUEST_METHOD.POST,
        body,
      }),
      transformResponse: (result: { data: TVipGiftInfo; code: number }) => {
        if (result.code === 401) {
          window.location.href = '/?code=401';
        }
        return result.data;
      },
    }),
    getMemberBonusRewards: builder.query<TMemberBonusRewardsConfig[], TMemberBonusRewards>({
      query: (body) => ({
        url: 'memberVipBonusReward/getRewards',
        headers: {
          token: localStorage.getItem('token')?.toString(),
          dev: dev_version,
          'Accept-Language': localStorage.getItem('lang')?.toString(),
        },
        method: REQUEST_METHOD.POST,
        body,
      }),
      keepUnusedDataFor: 0.0001,
      providesTags: ['daily_bonus'],
      transformResponse: (result: { data: { level: number; config: TMemberBonusRewardsConfig[] }; code: number }) => {
        if (result.code === 401) {
          window.location.href = '/?code=401';
        }
        return result?.data?.config;
      },
    }),
    collectDailyBonus: builder.mutation<TMemberBonusRewardsConfig[], TCollectBonusBonus>({
      query: (body) => ({
        headers: {
          token: localStorage.getItem('token')?.toString(),
          dev: dev_version,
          'Accept-Language': localStorage.getItem('lang')?.toString(),
        },
        url: 'memberVipBonusReward/collect',
        method: REQUEST_METHOD.POST,
        body,
      }),
      invalidatesTags: ['daily_bonus'],
    }),
  }),
});

export const { useGetVipGiftInfoQuery, useGetMemberBonusRewardsQuery, useCollectDailyBonusMutation } = dailyBonusApi;
