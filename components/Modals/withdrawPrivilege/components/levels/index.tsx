import { useEffect, useState } from 'react';
import { withdrawLimit } from '@/services/api';
import { TWithdrawLimit } from '@/services/response-type';
import NoData from '@/components/Customs/NoData';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const Levels = () => {
  const t = useTranslations().serveTranslation;
  const [withdrawal, setWithdrawal] = useState<TWithdrawLimit[]>([]);

  useEffect(() => {
    fetchWithdrawLimit();
  }, []);

  const fetchWithdrawLimit = async () => {
    const res = await withdrawLimit();
    if (res.data?.code === 200) {
      setWithdrawal(res?.data?.data);
    }
  };

  return (
    <div className={styles.levelsWrapper}>
      <div className={styles.headers}>
        <span>{t.upgradeLevel}</span>
        <span>{t.dailyLimit}</span>
        <span>{t.freeDailyQuota}</span>
        <span>{t.singleLimit}</span>
      </div>
      <div className={styles.body}>
        {!!withdrawal?.length ? (
          withdrawal?.map((items) => {
            return (
              <div
                key={items?.id}
                className={styles.dataContainer}
              >
                <span>VIP{items?.vipLevel}</span>
                <span>{items?.dailyWithdrawLimitTimes}</span>
                <span>{items?.withdrawLimitAmount}</span>
                <span>{items?.exceedWithdrawalFee}</span>
              </div>
            );
          })
        ) : (
          <div className={styles.noDataContainer}>
            <NoData />
          </div>
        )}
      </div>
    </div>
  );
};

export default Levels;
