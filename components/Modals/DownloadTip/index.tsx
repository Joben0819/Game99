import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import classNames from 'classnames';
import Button from '@/components/Customs/Button';
import CloseButton from '@/components/Customs/CloseButton';
import { useAppDispatch, useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const DownloadTip = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const dispatch = useAppDispatch();
  const t = useTranslations().download;
  const { userInfo } = useAppSelector((state) => state.userData);

  const closeModal = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
  };

  return (
    <div className={styles.VersionBackdrop}>
      <div className={styles.VersionBoard}>
        <CloseButton
          className={classNames(styles.closeButton, 'active:scale-75 active:opacity-90')}
          onClick={closeModal}
        />

        <div
          className={styles.downloadContent}
          data-lang={locale}
        >
          <div className={styles.title}>{t.modalTitle}</div>
          <div className={styles.contentTips}>
            <p>{t.content1}</p>
            <p>{t.content2}</p>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              text={t.buttonText}
              variant='orange'
              onClick={() => {
                userInfo?.phone == null || userInfo?.phone === ''
                  ? dispatch(setActiveModal(DATA_MODAL.BIND_PHONE))
                  : dispatch(setActiveModal(DATA_MODAL.BIND_EMAIL));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadTip;
