import Image from 'next/image';
import { memo } from 'react';
import { images } from '@/utils/resources';
import styles from './styles.module.scss';

const BackgroundImage = () => {
  return (
    <div className={styles.bgImage}>
      <Image src={images.act_claim_bg} alt="claim-bg" fill sizes="100%" priority />
    </div>
  );
};

export default memo(BackgroundImage);
