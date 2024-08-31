'use client';

import Image from 'next/image';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './styles.module.scss';

const CurrentLvl = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().dailyBonus;
  const userVipLvl = useAppSelector((state) => state.userData.userInfo.vip);

  return (
    <div className={styles.clWrapper}>
      <Image
        src={images.db_cur_lvl}
        alt=''
        fill
        sizes='25vw'
      />
      <span
        className={styles.currentLevel}
        data-lang={locale}
      >
        {t.current}: VIP {userVipLvl}
      </span>
    </div>
  );
};

export default CurrentLvl;
