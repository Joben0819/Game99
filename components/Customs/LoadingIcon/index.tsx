import Image from 'next/image';
import { memo } from 'react';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

const LoadingIcon = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingIcon}>
        <Image
          sizes="(max-width: 100vw) 100vw"
          alt=""
          src={images.loader}
          fill
          quality={100}
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default memo(LoadingIcon);
