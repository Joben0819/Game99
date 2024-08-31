import Image from 'next/image';
import { memo } from 'react';
import { images } from '@/utils/resources';
import styles from './styles.module.scss';

const Spinner = () => {
  return (
    <div className={styles.spinnerImage}>
      <Image src={images.act_spinner} alt="spinner-image" fill sizes="100%" />
    </div>
  );
};

export default memo(Spinner);
