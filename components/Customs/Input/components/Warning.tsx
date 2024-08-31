import Image from 'next/image';
import { images } from '@/utils/resources';
import styles from '../index.module.scss';
import { TWarningIconProps } from '../types/input';

export const WarningIcon: TWarningIconProps = ({ formState }) => {
  if (!formState) return null;

  return (
    <div
      className={styles.iconContainer}
      data-icon="warning"
    >
      <Image
        src={images.warning}
        alt="Invalid input"
        fill
      />
    </div>
  );
};
