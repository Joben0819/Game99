import Image from 'next/image';
import styles from '../index.module.scss';
import { TCustomIconProps } from '../types/input';

export const CustomIcon: TCustomIconProps = ({ customIcon }) => {
  if (!customIcon) return null;

  const { onClick, src, alt } = customIcon;

  return (
    <div
      className={styles.iconContainer}
      onClick={onClick}
      data-icon="custom"
    >
      <Image
        src={src}
        alt={alt}
        fill
      />
    </div>
  );
};
