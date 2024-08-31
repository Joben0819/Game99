import Image from 'next/image';
import { memo } from 'react';
import { images } from '@/utils/resources';
import styles from './styles.module.scss';

const Energy = () => {
  return (
    <div className={styles.chargeImage}>
      <Image src={images.act_energy_lg} alt="charge-icon" fill sizes="100%" />
    </div>
  );
};

export default memo(Energy);
