'use client';

import Image from 'next/image';
import { FC } from 'react';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

type BonusBannerProps = {
  Bonus: number;
};

const BonusBanner: FC<BonusBannerProps> = ({ Bonus }) => {
  return (
    <div className={styles.discountBanner}>
      <Image sizes="(max-width: 100vw) 100vw" alt="reward" src={images.discount_banner} fill quality={100} />
      <div className={styles.bonusText}>
        <span>+{moneyFormat(Bonus)}</span>
      </div>
    </div>
  );
};

export default BonusBanner;
