'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { IP } from '@/services/api';
import { ConfigProvider } from 'antd';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { PersistGate } from 'redux-persist/integration/react';
import PortalModal from '@/components/Modals/ModalPortal/portal';
import { persistor, store } from '@/store';
import { isLoggedIn } from '@/utils/helpers';
import AuthResetter from '../Customs/AuthResetter';
import InitFcm from '../Customs/InitFcm';
import Initialize from '../Customs/Initialize';
import LoginWithOtpHandler from '../Customs/LoginWithOtpHandler';

const { opAppKey } = require('@/server/' + process.env.SITE);

declare const servers: string[];

type ProvidersProps = {
  children: ReactNode;
};

const Providers: FC<ProvidersProps> = ({ children }) => {
  const searchParams = useSearchParams();
  const channelCode = searchParams.get('channelCode');
  const router = useRouter();
  const [serversFetched, setServersFetched] = useState<string[]>([]);

  useEffect(() => {
    if ((!channelCode || !channelCode?.length) && !localStorage.getItem('channelCode')) {
      const params = new URLSearchParams(window.location.search);
      params.set('channelCode', 'guanwang');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
      localStorage.setItem('channelCode', 'guanwang');
    }
    if (channelCode && !!channelCode?.length) localStorage.setItem('channelCode', channelCode);

    String(process.env.SITE) !== '9907' && getServers();

    IP()
      .then((res) => {
        localStorage.setItem('ip', res.data.ip);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const getServers = () => {
    if (!isLoggedIn() && typeof localStorage !== 'undefined' && !localStorage.getItem('op-ran')) {
      const script = document.createElement('script');
      script.id = 'open-install';
      script.src = 'https://opisntll76.s3.ap-southeast-3.amazonaws.com/serverstis.js';
      script.async = true;
      script.onload = function () {
        try {
          setServersFetched(servers);
        } catch (error) {
          console.error('Error running Servers script:', error);
        }
      };
      document.head.appendChild(script);
    }
  };

  const memoizedInitFcm = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof navigator?.serviceWorker !== 'undefined' &&
      window.location.protocol === 'https:' &&
      'Notification' in window ? (
        <InitFcm />
      ) : null,
    [],
  );

  return (
    <>
      {String(process.env.SITE) !== '9907' &&
        !isLoggedIn() &&
        !!serversFetched?.length &&
        typeof localStorage !== 'undefined' &&
        !localStorage.getItem('op-ran') && (
          <Script
            id='open-install'
            src='https://opisntll76.s3.ap-southeast-3.amazonaws.com/openinstall.js'
            onReady={() => {
              //@ts-ignore
              var data = OpenInstall.parseUrlParams();
              console.log('OP data:', data);

              //@ts-ignore
              new OpenInstall(
                {
                  appKey: opAppKey,
                  autoDownload: false,
                  servers: serversFetched,
                  channelCode: data?.channelCode || '1001',
                  apk: '',
                  ios: '',
                },
                data,
              );
              localStorage.setItem('op-ran', '1');
            }}
          />
        )}
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <ConfigProvider theme={{ hashed: false }}>
            <ProgressBar
              height='0.05rem'
              color='#ffaa09'
              options={{ showSpinner: false }}
              shallowRouting
            />
            <LoginWithOtpHandler />
            <AuthResetter />
            <Initialize />
            {/* <DisableDevtools /> */}
            {children}
            <PortalModal />
          </ConfigProvider>
        </PersistGate>
        <Toaster
          toastOptions={{
            style: {
              fontSize: '12px',
            },
          }}
        />
        {/* <InitAdjustSDK /> */}
        {memoizedInitFcm}
      </Provider>
    </>
  );
};

export default Providers;
