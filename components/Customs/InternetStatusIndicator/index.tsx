'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CSSProperties, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MODAL_ANIMATION } from '@/constants/app';
import { setSlowInternet } from '@/reducers/appData';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import Button from '../Button';
import HeaderTitle from '../HeaderTitle';
import styles from './styles.module.scss';

const InternetStatusIndicator = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations().internet;
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const { initData, language, slowInternet } = useAppSelector((state) => state.appData);
  const modalStyles = {
    visibility: `${isOnline ? 'hidden' : 'visible'}`,
    zIndex: `${isOnline ? 'unset' : '9999'}`,
  } as CSSProperties;

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(window.navigator.onLine);
      if (window.navigator.onLine) {
        toast.success(t.regainedConnection, { id: 'internet-indicator' });
      }
    };
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      dispatch(setSlowInternet(false));
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    setIsOnline(!slowInternet);
  }, [slowInternet]);

  const retryConnection = () => {
    const minDelay = 500;
    const maxDelay = 3000;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    setIsRetrying(true);
    if (!isOnline && !window.navigator.onLine) {
      setIsOnline(false);
      dispatch(setSlowInternet(false));
      setTimeout(() => setIsRetrying(false), randomDelay);
    } else {
      toast.success(t.regainedConnection, { id: 'internet-indicator' });
      setIsRetrying(false);
      setIsOnline(true);
    }
  };

  const LoadingIcon = () => {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingIcon}>
          <Image
            src={images.loader}
            alt='loader'
            fill
            priority
            unoptimized
          />
        </div>
      </div>
    );
  };

  const openNewTab = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClick = () => {
    router.prefetch(initData?.customerUrl);
    openNewTab(initData?.customerUrl);
  };

  return (
    <AnimatePresence>
      <div className={styles.hiddenLoader}>
        <LoadingIcon />
      </div>
      {/* hidden loader so the assets will be available for every retry */}
      <div
        className={styles.modalWrapper}
        key={'connectionModal'}
        style={modalStyles}
      >
        <motion.div
          variants={MODAL_ANIMATION}
          initial='hidden'
          animate='visible'
          exit='exit'
          className={styles.backDrop}
        >
          <div className={styles.modal}>
            <div className={styles.modalInnerWrapper}>
              {!isRetrying ? (
                <>
                  <div
                    className={styles.iconHolder}
                    onClick={handleClick}
                  >
                    <div className={styles.icon}>
                      <Image
                        sizes='(max-width: 100vw) 100vw'
                        alt='customer-service'
                        src={images.icon_cs}
                        fill
                        quality={100}
                        priority
                        data-lang={language}
                      />
                    </div>
                    <span
                      data-lang={language}
                      data-textafter={t.support}
                    >
                      {t.support}
                    </span>
                  </div>
                  <div className={styles.indicatorContainer} />
                  <div className={styles.contents}>
                    <HeaderTitle
                      text={t.tip}
                      size={30}
                    />
                    <p className={styles.details}>{t.content}</p>
                    <Button
                      text={t.retry}
                      onClick={retryConnection}
                      variant='orange'
                      width={locale === 'in' ? 3.3 : undefined}
                    />
                  </div>
                </>
              ) : (
                <LoadingIcon />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InternetStatusIndicator;
