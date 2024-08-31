'use client';

import Image from 'next/image';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const PopularBanner = () => {
  const t = useTranslations().payment;

  return (
    <div className={styles.popular}>
      <Image
        sizes='(max-width: 100vw) 100vw'
        alt='popular'
        src={t.popularImg}
        fill
        quality={100}
      />
    </div>
  );
};

export default PopularBanner;
