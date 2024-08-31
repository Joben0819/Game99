import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setPageLoad, setPrevPage } from '@/reducers/appData';
import { setInviterCode, setRegistrationData } from '@/reducers/userData';
import { getRegistrationData } from '@/services/api';
import { TRegistrationData } from '@/services/response-type';
import { motion } from 'framer-motion';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import RecordHeader from './components/RecordHeader';
import styles from './index.module.scss';

type TConvite<T> = {
  Share: () => T;
};

const Convite: <T>(props: TConvite<T>) => JSX.Element = ({ Share }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const tAffiliate = useTranslations().affiliate;
  const t = useTranslations().invite;
  const state = useSelector((state: RootState) => state.appData.activeInviteContent);
  const [regData, setRegData] = useState<TRegistrationData>();

  useEffect(() => {
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    // const intervalId = setInterval(fetchRegistrationData, 15000);

    state === t.myReferral && fetchRegistrationData();
    // return () => clearInterval(intervalId);
  }, []);

  const fetchRegistrationData = async () => {
    const res = await getRegistrationData();

    localStorage.setItem('inviteBGLink', res?.data?.backgroundImage);
    setRegData(res?.data);
    dispatch(setRegistrationData(res?.data));
  };

  return (
    <div className={styles.contentInfo}>
      <div className={styles.chestHeader}>
        <div>
          <span data-textafter={regData?.id}>{regData?.id}</span>
          <span>{t.myID}</span>
        </div>
        <div>
          <span data-textafter={regData?.inviterCode ?? t.none}>{regData?.inviterCode ?? t.none}</span>
          <span>{t.recommendID}</span>
        </div>
      </div>
      <div className={styles.conviteWrapper}>
        <div className={styles.headerWrapper}>
          <RecordHeader
            title={t.todayRegister}
            value={regData?.todayRegistered}
          />
          <RecordHeader
            title={t.totalRegister}
            value={regData?.totalRegistered}
          />
          <RecordHeader
            title={t.todayBonus}
            value={regData?.referralBonusToday}
            coin
          />
          <RecordHeader
            title={t.totalBonus}
            value={regData?.referralBonusTotal}
            coin
          />
        </div>
        <div
          className={styles.footerWrapper}
          data-lang={locale}
        >
          <div className={styles.footer}>
            <Image
              src={images.chest_icon}
              alt='chest'
              width={40}
              height={40}
            />
            <div className='ml-[0.15rem]'>
              <span>{t.shareLink}</span>
              <br />
              <span>{t.shareNote}</span>
            </div>
            <motion.span
              className={styles.button}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                Share();
              }}
            >
              {t.share}
            </motion.span>
          </div>
          <div className={styles.footer}>
            <Image
              src={images.qrcode}
              alt='chest'
              width={40}
              height={40}
            />
            <div className='ml-[0.15rem]'>
              <span>{t.shareQRCode}</span>
              <br />
              <span>{t.shareToFriend}</span>
            </div>
            <motion.span
              className={styles.button}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                dispatch(setPageLoad(true));
                router.push(`/invite/qr`);
                dispatch(setInviterCode(regData?.baseUrl));
                dispatch(setPrevPage(tAffiliate.myReferral));
              }}
            >
              {t.share}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convite;
