'use client';

import 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setPrevPage } from '@/reducers/appData';
import { setUserInfo } from '@/reducers/userData';
import { bindWithOtp, continueWithOtp, storeOtp } from '@/services/api';
import { useAppSelector } from '@/store';
import { deleteParams, getFcmTokenOnLogin, isLoggedIn } from '@/utils/helpers';

const LoginWithOtpHandler = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userOtp = searchParams.get('otp');
  const isAdjust = searchParams.get('link_token');
  const initData = useAppSelector((state) => state.appData.initData);
  const { userAdid } = useAppSelector((state) => state.userData);

  useEffect(() => {
    if (userOtp) {
      storeOtp(userOtp);
      localStorage.setItem('otp', userOtp);
      if (isLoggedIn()) {
        //means user is binding gmail
        bindWithOtpFn();
      } else {
        //means user is logging in using gmail
        if (typeof window !== 'undefined') {
          const initializeGuardian = async () => {
            const NEGuardian = await require('@/scripts/YiDunProtector-Web-2.0.3');
            if (NEGuardian) {
              const neg = NEGuardian({ appId: initData?.productId, timeout: 10000 });

              const generateToken = () => {
                neg.getToken().then((data: any) => {
                  const token = data?.token;
                  if (data?.code === 200) {
                    loginWithOtp(token);
                  }
                });
              };

              generateToken();
            }
          };
          initializeGuardian();
        }
      }
    }
  }, [userOtp]);

  const bindWithOtpFn = () => {
    bindWithOtp()
      .then((res: any) => {
        if (res?.data?.code === 200) {
          dispatch(setUserInfo(res.data?.data));
          toast.success(res?.data?.msg);
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .finally(() => {
        deleteParams('otp');
      });
  };

  const loginWithOtp = (token: string) => {
    const channelCode = localStorage.getItem('channelCode');
    const fcmToken = localStorage.getItem('fcm-token');
    continueWithOtp({
      ...(channelCode ? { channelCode } : {}),
      ...(isAdjust && userAdid ? { adjustId: userAdid } : {}),
      ...(isAdjust ? { isFromAdjust: true } : {}),
      ...(fcmToken ? { fcmToken } : {}),
      token: token ?? '',
    })
      .then((res: any) => {
        if (res?.data?.code === 200) {
          dispatch(setUserInfo(res.data?.data));
          dispatch(setPrevPage('loginRegister-page'));
          toast.success(res?.data?.msg);
          getFcmTokenOnLogin();
        } else {
          toast.error(res?.data?.msg);
        }
      })
      .finally(() => {
        deleteParams('otp');
      });
  };

  return null;
};

export default LoginWithOtpHandler;
