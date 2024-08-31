import { useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { withdrawLimit } from '@/services/api';
import { TWithdrawLimit } from '@/services/response-type';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const WithdrawLimit = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().vip;
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.userData);
  const [withdrawLimitList, setWithdrawLimitList] = useState<TWithdrawLimit[]>([]);

  useEffect(() => {
    withdrawLimit().then((res) => {
      if (res.data?.code === 200) {
        setWithdrawLimitList(res.data?.data);
      }
    });
  }, []);

  return (
    <div
      className={styles.withdrawLimitWrapper}
      data-lang={locale}
    >
      <h1>{t.withdrawLimit}</h1>
      <div className={styles.details}>
        <div className={styles.dailyNumber}>
          <span>{t.dailyNumber}</span>
          <span>
            0{' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='25'
              height='6'
              viewBox='0 0 25 6'
              fill='none'
            >
              <path
                d='M25 3L20 0.113249V5.88675L25 3ZM0 3.5L20.5 3.5V2.5L0 2.5L0 3.5Z'
                fill='#FF00B8'
              />
            </svg>{' '}
            <span className={styles.nextBenefit}>
              {withdrawLimitList?.find((item) => item?.vipLevel === userInfo?.vip)?.dailyWithdrawLimitTimes ?? 0}
            </span>
          </span>
        </div>
        <div className={styles.dailyQuota}>
          <span>{t.freeDailyQuota}</span>
          <span>
            0{' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='25'
              height='6'
              viewBox='0 0 25 6'
              fill='none'
            >
              <path
                d='M25 3L20 0.113249V5.88675L25 3ZM0 3.5L20.5 3.5V2.5L0 2.5L0 3.5Z'
                fill='#FF00B8'
              />
            </svg>{' '}
            <span className={styles.nextBenefit}>
              {withdrawLimitList?.find((item) => item?.vipLevel === userInfo?.vip)?.withdrawLimitAmount ?? 0}
            </span>
          </span>
        </div>
      </div>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={styles.detailsBtn}
        onClick={() => dispatch(setActiveModal(DATA_MODAL.WITHDRAW_PRIVILEGE))}
      >
        <span>{t.detail}</span>
      </motion.div>
    </div>
  );
};

export default WithdrawLimit;
