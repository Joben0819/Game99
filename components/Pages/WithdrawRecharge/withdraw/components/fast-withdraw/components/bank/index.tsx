import Image from 'next/image';
import { FC, memo } from 'react';
import classNames from 'classnames';
import { images } from '@/utils/resources';
import styles from './index.module.scss';

type BankProps = {
  icon: string;
  id: number;
  name: string;
  isActive: boolean;
  handleActiveBank: (id: number) => void;
};

const Bank: FC<BankProps> = ({ icon, id, name, isActive, handleActiveBank }) => {
  return (
    <div
      className={styles.bank}
      onClick={() => handleActiveBank(id)}
    >
      <div className={styles.titleIcon}>
        <div className={styles.icon}>
          <Image
            src={icon || images.bank_default_icon}
            alt='icon'
            fill
            sizes='100%'
          />
        </div>
        <span>{name}</span>
      </div>
      <div className={classNames(styles.status, 'btn')}>
        <Image
          src={isActive ? images.bank_active : images.bank_inactive}
          alt='icon'
          fill
          sizes='100%'
        />
      </div>
    </div>
  );
};

export default memo(Bank);
