import Image from 'next/image';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { useAppDispatch } from '@/store';
import { staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const CS = () => {
  const t = useTranslations().vip;
  const dispatch = useAppDispatch();

  return (
    <div className={styles.csWrapper}>
      <div className={styles.header}>
        <h1>{t.other}</h1>
      </div>
      <div
        className={styles.csBtn}
        onClick={() => {
          localStorage.setItem('recent-modal', 'VIP');
          dispatch(setActiveModal(DATA_MODAL.SUPPORT));
        }}
      >
        <div className={styles.csIcon}>
          <Image
            sizes='25vw'
            alt='CS'
            src={staticImport.customer_service}
            height={101}
            width={116}
            quality={100}
            priority
            placeholder='blur'
          />
          <span>{t.vipExclusive}</span>
        </div>
      </div>
    </div>
  );
};

export default CS;
