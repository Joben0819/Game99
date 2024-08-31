import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { pushNotiSubscribe, updateFcmToken } from '@/services/api';
import { getMessaging, getToken } from 'firebase/messaging';
import { useAppSelector } from '@/store';
import firebaseApp from '@/utils/firebase';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const { VAPID_KEY } = require('@/server/' + process.env.SITE);

const PermissionPopup = () => {
  const canAllowNotification = Notification && Notification.permission === 'default';
  const userToken = useAppSelector((s) => s.userData.userInfo.token);
  const [generatedToken, setGeneratedToken] = useState('');
  const fcmTokenFromStorage = localStorage.getItem('fcm-token');
  const [isPopupOpen, setIsPopupOpen] = useState(canAllowNotification);
  const isSubscribingRef = useRef(false);
  const t = useTranslations().notification;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!generatedToken || !userToken) return;
    if (!localStorage.getItem('fcm-subscribed') && fcmTokenFromStorage && !isSubscribingRef.current) {
      isSubscribingRef.current = true;
      pushNotiSubscribe({ fcmToken: generatedToken })
        .then((res) => {
          if (res.data?.code === 200) {
            localStorage.setItem('fcm-subscribed', '1');
          }
        })
        .finally(() => {
          isSubscribingRef.current = false;
        });
    }
  }, [generatedToken, userToken]);

  useEffect(() => {
    const ensureThatFcmTokenIsUpdated = () => {
      if (!canAllowNotification || !userToken || !generatedToken) return;
      updateFcmToken({ fcmToken: generatedToken });
    };

    ensureThatFcmTokenIsUpdated();
  }, [userToken, generatedToken]);

  if (!isPopupOpen || Notification.permission === 'granted') return null;

  return (
    <div className={styles.popup}>
      <div className={styles.content}>
        <Image
          src={require(`@/public/variant/${process.env.SITE}/icon512_rounded.png`)}
          alt='Site logo'
        />
        <div>
          <h6>
            {process.env.SITE_TITLE} {t.heading}.
          </h6>
          <span>{t.content}.</span>
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          onClick={() => {
            const messaging = getMessaging(firebaseApp);
            getToken(messaging, {
              vapidKey: VAPID_KEY,
            })
              .then((token) => {
                localStorage.setItem('fcm-token', token);
                setGeneratedToken(token);
              })
              .finally(() => setIsPopupOpen(false));
            setIsPopupOpen(false);
          }}
        >
          {t.allow}
        </button>
        <button onClick={() => setIsPopupOpen(false)}>{t.deny}</button>
      </div>
    </div>
  );
};

export default PermissionPopup;
