import Image from 'next/image';
import { images } from '@/utils/resources';
import styles from '../index.module.scss';
import { TPasswordIconProps } from '../types/input';

export const PasswordIcon: TPasswordIconProps = ({ type, showPassword, setShowPassword, formState }) => {
  const icon = showPassword ? images.eye_on : images.eye_off;
  const alt = showPassword ? 'Mask password' : 'Show password';

  if (type !== 'password' || !!formState) return null;

  return (
    <div
      className={styles.iconContainer}
      onClick={() => setShowPassword(!showPassword)}
      data-icon="password"
    >
      <Image
        src={icon}
        alt={alt}
        fill
      />
    </div>
  );
};
