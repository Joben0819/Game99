'use client';

import { useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { DATA_LANG } from '@/constants/enums';
import { setLanguage } from '@/reducers/appData';
import { resetUserDataState } from '@/reducers/userData';
import { storeLang } from '@/services/api';
import Home from '@/components/Home';
import LoadingScreen from '@/components/LoadingScreen';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteParams, isLoggedIn } from '@/utils/helpers';
import { useWithDispatch } from '@/hooks/useWithDispatch';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const { resetInternetStatus } = useWithDispatch();
  const { userInfo, personalCenter } = useAppSelector((state) => state.userData);
  const isSplashScreenLoaded = localStorage.getItem('isSplashScreenLoaded');
  const [showHome, setShowHome] = useState(!!(userInfo?.id && isLoggedIn()));

  useEffect(() => {
    const lang = localStorage.getItem('lang') as DATA_LANG;
    if (lang) {
      storeLang(lang);
      dispatch(setLanguage(lang));
    } else {
      localStorage.setItem('lang', 'in');
      dispatch(setLanguage(DATA_LANG.IND));
    }
    resetInternetStatus();
    // for NEW PERSIST-STORE clean-up, remove in the future
    if (personalCenter === undefined) dispatch(resetUserDataState());
  }, []);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/cache-storage-sw.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }

    if (userInfo?.id && isLoggedIn()) {
      setShowHome(true);
      deleteParams('code');
    } else {
      if (isSplashScreenLoaded === 'true') {
        setShowHome(true);
      } else {
        setShowHome(false);
      }
    }
  }, [userInfo, code, isSplashScreenLoaded]);

  return <Fragment>{showHome ? <Home /> : <LoadingScreen setShowHome={setShowHome} />}</Fragment>;
}
