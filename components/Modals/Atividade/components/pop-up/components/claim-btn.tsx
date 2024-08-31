import Image from 'next/image';
import { FC } from 'react';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './styles.module.scss';

type ClaimBtnProps = {
  onClose: () => void;
};

const ClaimBtn: FC<ClaimBtnProps> = ({ onClose }) => {
  const t = useTranslations().activity;

  return (
    <div
      className={styles.button}
      onClick={onClose}
    >
      <Image
        src={images.db_collect_img}
        alt='charge-icon'
        fill
        sizes='100%'
      />
      <span>{t.accept}</span>
    </div>
  );
};

export default ClaimBtn;
