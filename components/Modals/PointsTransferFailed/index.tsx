import { useRouter } from 'next/navigation';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { setActiveTab } from '@/reducers/userData';
import Button from '@/components/Customs/Button';
import { useAppDispatch } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const PointsTransferFailedComponent = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations().game;

  const handleClose = () => {
    dispatch(setActiveTab(2)); //game balance
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    setTimeout(() => push(`/personal-center`), 200);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.content}>
        <div className={styles.body}>
          <h3>{t.pointsFailedTransferTitle}</h3>
          <p>{t.pointsFailedTransferContent}</p>
          <Button
            variant='orange'
            text={t.proceed}
            onClick={handleClose}
          />
        </div>
      </div>
    </div>
  );
};

export default PointsTransferFailedComponent;
