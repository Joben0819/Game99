'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { osVersion } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { setUserAdid } from '@/reducers/userData';
import { IP } from '@/services/api';
import axios from 'axios';
import { connectAdjustIndexDB } from '@/utils/adjust-indexdb';
import { useAppSelector } from './../../../store/index';

// export enum Game99Events {
//   LOGIN = 'kukpqv',
//   LOGOUT = 'dob5hp',
//   REGISTER_CLICK = 'tiyxxq',
//   REGISTER = '3n0bly',
//   RECHARGE_CLICK = 'e8hveg',
//   FIRST_RECHARGE = 'fe3yl1',
//   RECHARGE = 'ly9jl8',
//   WITHDRAW_CLICK = 'fkuuix',
//   WITHDRAW_ORDER_SUCCESS = 'fxwbpg',
//   ENTER_GAME = 'dz63p1',
//   VIP_REWARD = 'evnfwt',
//   DAILY_REWARD = 'b6kbf4',
//   ENTER_EVENT_CENTER = '2m1w53',
//   ENTER_TASK = '7pl3z8',
//   ENTER_CASHBACK = 'q3gxlg',
//   // ENTER_PROMOTE = '12vjpu', //android
//   ENTER_PROMOTE = '3ujk45',
//   BANNER_CLICK = 'kvtwmc',
// }
// export enum Game99Events {
//   LOGIN = "3k599c",
//   LOGOUT = "srprua",
//   REGISTER_CLICK = "dj1gwp",
//   REGISTER = "kkx4oe",
//   RECHARGE_CLICK = "evonpd",
//   FIRST_RECHARGE = "pz26vy",
//   RECHARGE = "wx5wu7",
//   WITHDRAW_CLICK = "rk1djo",
//   WITHDRAW_ORDER_SUCCESS = "w996ks",
//   ENTER_GAME = "sqvxjp",
//   VIP_REWARD = "wblvy2",
//   DAILY_REWARD = "ass9fl",
//   ENTER_EVENT_CENTER = "yahfkj",
//   ENTER_TASK = "3jn0ci",
//   ENTER_CASHBACK = "d1ko99",
//   ENTER_PROMOTE = "ac0q16",
//   BANNER_CLICK = "vs59kg",
// }
//App-Secret = (1, 1868137812, 953451899, 378452243, 185094484)

const { ADJUST_APP_TOKEN, ADJUST_BEARER_TOKEN, ADJUST_ENV } = require('@/server/' + process.env.SITE);

const InitAdjustSDK = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const userAdid = useAppSelector((state) => state.userData.userAdid);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeAdjust();
    }
  }, [searchParams]);

  const getToken = async (token: string | null) => {
    if (!token) return;
    const initialUrl = `/api-adjust/public/v2/apps/${ADJUST_APP_TOKEN}/trackers/${token}/children/`;
    let lastToken = '';
    const headers = { Authorization: 'Bearer ' + ADJUST_BEARER_TOKEN };
    try {
      // First request
      const response1 = await axios.get(initialUrl, { headers: headers });
      console.log('Response from initial URL:', response1.data);
      if (!response1.data?.data?.items?.length) return lastToken;
      lastToken = response1.data?.data?.items[0]?.token;

      // Extract the next URL from the first response
      const url2 = `/api-adjust/public/v2/apps/${ADJUST_APP_TOKEN}/trackers/${response1.data?.data?.items[0]?.token}/children/`;

      // Second request using the extracted URL
      const response2 = await axios.get(url2, { headers: headers });
      console.log('Response from URL 2:', response2.data);
      if (!response2.data?.data?.items?.length) return lastToken;
      lastToken = response2.data?.data?.items[0]?.token;

      // Extract the next URL from the second response
      const url3 = `/api-adjust/public/v2/apps/${ADJUST_APP_TOKEN}/trackers/${response2.data?.data?.items[0]?.token}/children/`;

      // Third request using the extracted URL
      const response3 = await axios.get(url3, { headers: headers });
      console.log('Response from URL 3:', response3.data);
      if (!response3.data?.data?.items?.length) return lastToken;
      lastToken = response3.data?.data?.items[0]?.token;

      // Handle final response
      console.log('Final data:', response3.data);

      return lastToken;
    } catch (error) {
      console.error('Error in Axios request chain:', error);
    }
  };

  const initializeAdjust = async () => {
    let ipValue;
    if (localStorage.getItem('ip')) ipValue = localStorage.getItem('ip');
    else {
      const ipReq = await IP();
      ipValue = ipReq?.data?.ip;
    }

    const ip = ipValue;
    const sh = window.outerHeight;
    const sw = window.outerWidth;
    const os_ver = osVersion;
    const link_token = searchParams.get('link_token');
    !!link_token?.length ? localStorage.setItem('local_adjust_token', link_token) : '';
    const local_adjust_token = localStorage.getItem('local_adjust_token');
    const data = { initial: true, ip, device_id: '0', device: 'web', sh, sw, os_ver };
    const Adjust = await require('@adjustcom/adjust-web-sdk');
    if (Adjust && (link_token || local_adjust_token)) {
      const defaultTracker = await getToken(link_token);

      console.log('Default Tracker:', defaultTracker);

      Adjust.addGlobalCallbackParameters([{ key: 'data', value: JSON.stringify(data) }]);

      await Adjust.initSdk({
        appToken: ADJUST_APP_TOKEN, //9901 web
        environment: ADJUST_ENV,
        attributionCallback: function (e: any, attribution: any) {
          console.log('Adjust Attribution Callback: ', attribution);
          dispatch(setUserAdid(attribution?.adid));
        },
        logLevel: 'verbose',
        defaultTracker,
      });

      setTimeout(() => {
        if (Adjust.getWebUUID() && !userAdid) {
          connectAdjustIndexDB().then((res) => dispatch(setUserAdid(res)));
        }
      }, 500);
    } else !userAdid && connectAdjustIndexDB().then((res) => dispatch(setUserAdid(res)));
  };
  return null;
};

export default InitAdjustSDK;
