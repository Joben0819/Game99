'use client';

import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveGamesType, setActiveModal } from '@/reducers/appData';
import { resetPaymentData } from '@/reducers/paymentData';
import { resetUserDataState } from '@/reducers/userData';
import { AnimatePresence, motion } from 'framer-motion';
import { RootState } from '@/store';
import { isLoggedIn } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import LoadingBar from './components/LoadingBar';
import styles from './index.module.scss';

type LoadingScreenProps = {
  setShowHome: Dispatch<SetStateAction<boolean>>;
};

const LoadingScreen: FC<LoadingScreenProps> = ({ setShowHome }) => {
  const dispatch = useDispatch();
  const t = useTranslations().home;
  const { getNewLoginMethods } = useWithDispatch();
  const { gamesTypeItems, language } = useSelector((state: RootState) => state.appData);
  const { userInfo } = useSelector((state: RootState) => state.userData);

  useEffect(() => {
    localStorage.removeItem('platformId');

    if (!isLoggedIn() && !!userInfo?.id?.length) {
      dispatch(resetUserDataState());
    }
    if (isLoggedIn() && !userInfo?.id?.length) {
      localStorage.removeItem('token');
    }
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(resetPaymentData());
    getNewLoginMethods();

    return () => {
      if (gamesTypeItems) {
        dispatch(setActiveGamesType(gamesTypeItems[0]));
      }
    };
  }, []);

  return (
    <>
      <div className={styles.loadingScreenWrapper}>
        <div className={styles.bg}>
          <Image
            sizes='(max-width: 100vw) 100vw'
            alt='loading_bg'
            src={`/variant/${process.env.SITE}/loading_bg.png` ?? staticImport.game_item_placeholder}
            fill
            quality={100}
            priority
          />
        </div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={styles.supportImg}
          onClick={() => dispatch(setActiveModal(DATA_MODAL.SUPPORT))}
          data-lang={language}
        >
          <Image
            sizes='(max-width: 100vw) 100vw'
            alt='logo'
            src={images.cs_icon1 ?? staticImport.game_item_placeholder}
            width={74}
            height={62}
            quality={100}
          />
          <span>{t.support}</span>
        </motion.div>

        <AnimatePresence key={'loadingLogo'}>
          {String(process.env.SITE) !== '9901' &&
            String(process.env.SITE) !== '9906' &&
            String(process.env.SITE) !== '9907' &&
            String(process.env.SITE) !== '9908' && (
              <motion.div
                key={'logoImg'}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={styles.logoImg}
              >
                <Image
                  sizes='(max-width: 100vw) 100vw'
                  alt='logo'
                  src={`/variant/${process.env.SITE}/loading_logo_.webp` ?? staticImport.game_item_placeholder}
                  fill
                  quality={100}
                  priority
                />
              </motion.div>
            )}
          <LoadingBar setShowHome={setShowHome} />
          <span
            key={'version'}
            className={styles.appVersion}
          >
            v{process.env.APP_VERSION}
          </span>
        </AnimatePresence>
      </div>
    </>
  );
};

export default LoadingScreen;
