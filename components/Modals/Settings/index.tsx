import Image from 'next/image';
import { APK_EVENT } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { motion } from 'framer-motion';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useAppDispatch } from '@/store';
import { isLoggedIn, triggerApkEvent } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import LanguageControls from './components/language.settings';
import Toggler from './components/toggler.settings';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import classnames from 'classnames';

const Settings = () => {
  const t = useTranslations().settings;
  const dispatch = useAppDispatch();
  const { logoutUser } = useWithDispatch();
  const [hasCaches, setHasCaches] = useState<boolean>(false);

  useEffect(() => {
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
          if (cacheNames.length > 0) {
              setHasCaches(true);
          } else {
              setHasCaches(false);
          }
      }).catch(function(error) {
          console.error('Error checking caches:', error);
      });
  } else {
      console.log('Cache API is not supported in this browser.');
  }
  }, []);

  const renderCloseButton = () => (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={styles.closeSettingsModalBtn}
      onClick={() => {
        dispatch(setActiveModal(''));
      }}
    >
      <Image
        src={images.settings_btn_close}
        width={108}
        height={108}
        alt='close'
      />
    </motion.div>
  );

  const renderLogoutButton = () => (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={styles.userSettingsBtn}
      onClick={() => {
        triggerApkEvent(APK_EVENT.LOGOUT);
        logoutUser();
      }}
    >
       <Image src={images.settings_logout} width={12} height={12} alt='logout' /> {t.logout}
    </motion.button>
  );

  const renderClearCacheButton = () => (
    <motion.button
      whileTap={hasCaches ? { scale: 0.9 } : {}}
      className={classnames(styles.userSettingsBtn, styles['userSettingsBtn--clearCache'], {
        [styles['userSettingsBtn--disabled']]: !hasCaches,
      })}
      onClick={() => {
        if(!hasCaches) return;

        if ('caches' in window) {
          caches.keys().then(function(names) {
              for (let name of names) {
                  caches.delete(name);
              }
              setHasCaches(false);
          });
      }
      }}
    >
      <Image src={images.settings_clear_cache} width={12} height={12} alt='clear cache' /> {t.clearCache}
    </motion.button>
  );

  return (
    <div className={styles.backdrop}>
      <div className={styles.wrapper}>
        {renderCloseButton()}
        <div className={styles.settingsModal}>
          <HeaderTitle
            text={t.title}
            className={styles.settingsTitle}
            size={32}
          />
          <div className={styles.settingsControls}>
            <div className={styles.bgmControls}>
              <Toggler type='music' />
              <Toggler type='sound' />
            </div>
            <LanguageControls />
          </div>
          <div className={styles.divider} />
          <span className={styles.gameVersion}>v{process.env.APP_VERSION}</span>
          <div className={styles.settingsButtonContainer}>
          {isLoggedIn() && renderLogoutButton()}
          {isLoggedIn() && renderClearCacheButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
