import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import NoData from '@/components/Customs/NoData';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const Levels = () => {
  const t = useTranslations().rescueFund;
  const { userInfo } = useAppSelector((state) => state.userData);
  const { vipGiftInfo } = useAppSelector((state) => state.appData);
  const levelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (vipGiftInfo?.vipSetList?.length && userInfo.vip > 5) {
      const vipEl = document.getElementById(`activeLevel`);
      setTimeout(() => {
        levelRef.current?.scrollTo({
          top: vipEl!.offsetTop - vipEl!.scrollHeight * 5,
          behavior: 'smooth',
        });
      }, 500);
    }
  }, [userInfo.vip, vipGiftInfo?.vipSetList]);

  return (
    <div className={styles.levelsWrapper}>
      <div className={styles.headers}>
        <span>{t.level}</span>
        <span>{t.bonusPercentage}</span>
      </div>
      <div
        className={styles.body}
        ref={levelRef}
      >
        {!!vipGiftInfo?.vipSetList ? (
          vipGiftInfo?.vipSetList.map((row, idx) => {
            return (
              <div
              key={`${idx}-${row.bcode}`}
                className={classNames(styles.dataContainer, {[styles.isMatched]: userInfo.vip === row.level})}
                id={userInfo.vip === row.level ? 'activeLevel' : 'inActive'}
              >
                <span>VIP{row.level}</span>
                <span>{`${(row.rescueBonusRate * 100).toFixed()}%`}</span>
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
