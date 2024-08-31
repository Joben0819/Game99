import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import NoData from '@/components/Customs/NoData';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const Levels = () => {
  const t = useTranslations().nextLevel;
  const userInfo = useAppSelector((state) => state.userData.userInfo);
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
        <span>{t.rescue}</span>
        <span>{t.upgrade}</span>
        <span>{t.everyWeek}</span>
        <span>{t.everyMonth}</span>
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
                className={classNames(styles.dataContainer, { [styles.isMatched]: userInfo.vip === row.level })}
                id={userInfo.vip === row.level ? 'activeLevel' : 'inActive'}
              >
                <span>VIP{row.level}</span>
                <span>{`${moneyFormat(row.rescueBonusRate * 100)}%`}</span>
                <span>{moneyFormat(row.levelBonus)}</span>
                <span>{moneyFormat(row.weekBonus)}</span>
                <span>{moneyFormat(row.monthBonus)}</span>
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
