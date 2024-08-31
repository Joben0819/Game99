'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CONTENT_BY_JUMPTYPE } from '@/constants/app';
import { DATA_MODAL, JUMP_TYPE } from '@/constants/enums';
import {
  setActiveInviteContent,
  setActiveModal,
  setPageLoad,
  setPrevPage,
  setSideNotification,
} from '@/reducers/appData';
// import { pushNotiSubscribe } from '@/services/api';
import { getMessaging, onMessage } from 'firebase/messaging';
// import { useAppSelector } from '@/store';
import firebaseApp from '@/utils/firebase';
import { useTranslations } from '@/hooks/useTranslations';
import PermissionPopup from '../PermissionPopup';

// const { VAPID_KEY } = require('@/server/' + process.env.SITE);

// let timesRepeated = 0;
function InitFcm() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations().affiliate;
  // const { userInfo } = useAppSelector((s) => s.userData);
  // const [token, setToken] = useState('');
  // const isSubscribingRef = useRef(false);

  if (pathname.includes('pinduoduo') || pathname.includes('recharge-bonus') || pathname.includes('roulette')) return;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
  //   const retrieveToken = async () => {
  //     timesRepeated++;
  //     try {
  //       if (typeof window !== 'undefined' && 'serviceWorker' in navigator && typeof Notification !== 'undefined') {
  //         const messaging = getMessaging();

  //         // Retrieve the notification permission status
  //         const permission = await Notification.requestPermission();

  //         // Check if permission is granted before retrieving the token
  //         if (permission === 'granted') {
  //           const currentToken = await getToken(messaging, {
  //             vapidKey: VAPID_KEY,
  //           });
  //           if (currentToken) {
  //             localStorage.setItem('fcm-token', currentToken);
  //             setToken(currentToken);
  //           } else {
  //             console.log('No registration token available. Request permission to generate one.');
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       timesRepeated <= 10 && retrieveToken();
  //       // console.log('An error occurred while retrieving token:', error);
  //     }
  //   };

  //   retrieveToken();
  // }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const messaging = getMessaging(firebaseApp);

    const handleForegroundMessage = (payload: any) => {
      const notificationTitle = payload.data?.title || 'Default title';
      const notificationOptions = {
        body: payload.data?.content || 'Default message body',
        icon: `./variant/${process.env.SITE}/icon512_rounded.png`,
        data: payload.data, // Pass additional data if needed
      };

      const showNotification = () => {
        new Notification(notificationTitle, notificationOptions).onclick = (event: any) => {
          if (event.currentTarget?.data) {
            //for activityTypeId
            if (event.currentTarget?.data?.activityTypeId) {
              localStorage.setItem('banner-clicked', event.currentTarget?.data?.activityTypeId);
              dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
            }
            //for jumpType
            const handleRedirect = (url: string, recent: string, isRedirecting: boolean, activeContent?: string) => {
              localStorage.setItem('recent-modal', recent);
              dispatch(setPageLoad(isRedirecting));
              router.push(url);
              if (activeContent) dispatch(setActiveInviteContent(activeContent));
            };
            if (event.currentTarget?.data?.jumpType) {
              const jumpType = event.currentTarget?.data?.jumpType as JUMP_TYPE;
              const active = CONTENT_BY_JUMPTYPE[jumpType];
              if (active === 'recharge-page') {
                dispatch(setPageLoad(true));
                router.push('/recharge');
              } else if (active === 'referral-page') {
                if (jumpType === JUMP_TYPE.PINDUODUO) handleRedirect('/invite', DATA_MODAL.CLOSE, true, t.redEnvelope);
                else handleRedirect('/invite', DATA_MODAL.CLOSE, true, t.invitationRules);
                dispatch(setPrevPage('other-page'));
                dispatch(setPageLoad(true));
                dispatch(setActiveModal(DATA_MODAL.CLOSE));
              } else {
                dispatch(setActiveModal(active));
              }
            }
          }
        };
      };

      if (Notification && Notification.permission === 'granted') {
        if (payload.data?.notificationType === 'NOTIFICATION') showNotification();
        if (payload.data?.notificationType === 'GAMEWINNER') dispatch(setSideNotification(payload.data));
      }
    };

    const unsubscribe = onMessage(messaging, handleForegroundMessage);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator?.serviceWorker?.addEventListener('message', (event) => {
        if (event.data?.type === 'BG_NOTIFICATION_CLICKED') {
          if (event.data?.data) {
            //for activityTypeId
            if (event.data?.data?.activityTypeId) {
              localStorage.setItem('banner-clicked', event.data?.data?.activityTypeId);
              dispatch(setActiveModal(DATA_MODAL.ACTIVITIES));
            }
            //for jumpType
            const handleRedirect = (url: string, recent: string, isRedirecting: boolean, activeContent?: string) => {
              localStorage.setItem('recent-modal', recent);
              dispatch(setPageLoad(isRedirecting));
              router.push(url);
              if (activeContent) dispatch(setActiveInviteContent(activeContent));
            };
            if (event.data?.data?.jumpType) {
              const jumpType = event.data?.data?.jumpType as JUMP_TYPE;
              const active = CONTENT_BY_JUMPTYPE[jumpType];
              if (active === 'recharge-page') {
                dispatch(setPageLoad(true));
                router.push('/recharge');
              } else if (active === 'referral-page') {
                if (jumpType === JUMP_TYPE.PINDUODUO) handleRedirect('/invite', DATA_MODAL.CLOSE, true, t.redEnvelope);
                else handleRedirect('/invite', DATA_MODAL.CLOSE, true, t.invitationRules);
                dispatch(setPrevPage('other-page'));
                dispatch(setPageLoad(true));
                dispatch(setActiveModal(DATA_MODAL.CLOSE));
              } else {
                dispatch(setActiveModal(active));
              }
            }
          }
        }
      });
    }

    return () => {};
  }, []);

  if (Notification && Notification.permission === 'default') return <PermissionPopup />;

  return null;
}

export default InitFcm;
