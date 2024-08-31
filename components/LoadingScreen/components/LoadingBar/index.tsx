'use client';

import { useSearchParams } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
// import { isIOS } from 'react-device-detect';
import { Progress } from 'antd';
import { useAppSelector } from '@/store';
// import { isProduction } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type LoadingBarProps = {
  setShowHome: Dispatch<SetStateAction<boolean>>;
};

const LoadingBar: FC<LoadingBarProps> = ({ setShowHome }) => {
  const t = useTranslations().login;
  const [counter, setCounter] = useState<number>(0);
  const userInfo = useAppSelector((state) => state.userData.userInfo);
  const searchParams = useSearchParams();
  const interval = searchParams.get('link_token') ? 100 : 45;

  useEffect(() => {
    let counterTimer = setInterval(() => {
      setCounter((prev) => {
        if (prev < 100) {
<<<<<<< HEAD
          if (isProduction && !isIOS && typeof Notification !== 'undefined') {
            const isNotifGranted = Notification.permission === 'granted';
            const fcmToken = localStorage.getItem('fcm-token');
            if (isNotifGranted && !fcmToken) return prev;
          }
=======
          // if (isProduction && !isIOS && typeof Notification !== 'undefined') {
          //   const isNotifGranted = Notification.permission === 'granted';
          //   const fcmToken = localStorage.getItem('fcm-token');
          //   if (isNotifGranted && !fcmToken) return prev;
          // }
>>>>>>> 012875396aca2c013c66af2a006c7b97b190d90c
          return prev + 1;
        } else if (prev >= 100) {
          localStorage.setItem('isSplashScreenLoaded', 'true');
          setTimeout(() => setShowHome(true), 1000);
          return prev;
        } else {
          return prev;
        }
      });
    }, interval);

    return () => {
      clearInterval(counterTimer);
    };
  }, [userInfo]);

  return (
    <div className={styles.loadingWrapper}>
      <span>{t.loginLoading}</span>
      <span>{counter}%</span>
      <Progress
        percent={counter}
        showInfo={false}
        trailColor='rgba(0, 0, 0, 0.50)'
      />
    </div>
  );
};

export default LoadingBar;
