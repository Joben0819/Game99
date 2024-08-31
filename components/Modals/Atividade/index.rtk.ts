import { REQUEST_METHOD } from '@/constants/enums';
import { Domain, dev_version, platform } from '@/services/api';
import { TClaimMissionReward, TGetRepeatMissionActivityList, TMissionActivities } from '@/services/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const activitiesApi = createApi({
  reducerPath: 'activitiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${Domain}${platform}` }),
  tagTypes: ['activities'],
  endpoints: (builder) => ({
    getRepeatMissionActivityList: builder.query<TMissionActivities, TGetRepeatMissionActivityList>({
      query: (body) => ({
        url: 'getRepeatMissionActivityList',
        headers: {
          token: localStorage.getItem('token')?.toString(),
          dev: dev_version,
          'Accept-Language': localStorage.getItem('lang')?.toString(),
        },
        method: REQUEST_METHOD.POST,
        body,
      }),
      providesTags: ['activities'],
      transformResponse: (result: { data: TMissionActivities; code: number; msg: string }) => {
        if (result.code === 401) {
          window.location.href = '/?code=401';
        }
        if (result.code !== 200) {
          return {} as TMissionActivities;
        }
        return result.data;
      },
    }),
    claimMissionReward: builder.mutation<any, TClaimMissionReward>({
      query: (body) => ({
        headers: {
          token: localStorage.getItem('token')?.toString(),
          dev: dev_version,
          'Accept-Language': localStorage.getItem('lang')?.toString(),
        },
        url: 'claimMissionReward',
        method: REQUEST_METHOD.POST,
        body,
      }),
      invalidatesTags: ['activities'],
    }),
  }),
});

export const { useGetRepeatMissionActivityListQuery, useClaimMissionRewardMutation } = activitiesApi;
