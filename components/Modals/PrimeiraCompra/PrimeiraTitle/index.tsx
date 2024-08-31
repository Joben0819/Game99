import Image from 'next/image';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const PrimeiraTitle = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().firstRecharge;

  return (
    <div className={styles.primeiraWrapper}>
      <div
        className={styles.primeiraTitleContainer}
        data-lang={locale}
      >
        <div className={styles.primeiraTitle}>
          <Image
            src={t.modalTitle}
            sizes='(max-width: 100vw) 100vw'
            alt='close-button'
            fill
            quality={100}
          />
        </div>
      </div>
    </div>
  );
};

export default PrimeiraTitle;
