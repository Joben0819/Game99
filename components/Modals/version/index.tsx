import Image from 'next/image';
import { memo } from 'react';
import { sampleUpdates } from '@/constants/app';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setFourthModal } from '@/reducers/appData';
import { useAppDispatch, useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

const VersionComponent = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useAppDispatch();
  const t = useTranslations().announcement;

  const closeModal = () => {
    dispatch(setFourthModal(DATA_MODAL.CLOSE));
  };

  return (
    <div className={styles.VersionBackdrop}>
      <div className={styles.VersionBoard}>
        <Image
          src={images.version_bg}
          sizes='(max-width: 100vw) 100vw'
          alt='background'
          fill
          quality={100}
        />
        <div className={styles.versionContainer}>
          <div
            className={styles.title}
            data-textafter={t.newVersion}
          >
            {t.newVersion}
          </div>
          <div className={styles.details}>
            <span>v{process.env.APP_VERSION}</span>
            {sampleUpdates.map((item, index) => (
              <span key={index}>
                {index + 1}. {item?.update}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.btnContainer}>
          <div>
            <Image
              src={images.btn_orange}
              alt='orange'
              width={100}
              height={30}
            />
            <span
              data-lang={locale}
              data-textafter={t.reminder}
              onClick={closeModal}
            >
              {t.reminder}
            </span>
          </div>
          <div>
            <Image
              src={images.btn_blue}
              alt='blue'
              width={100}
              height={30}
            />
            <span
              data-lang={locale}
              data-textafter={t.upgrade}
            >
              {t.upgrade}
            </span>
          </div>
        </div>
        <CloseBtn />
      </div>
    </div>
  );
};

const CloseBtn = memo(() => {
  const dispatch = useAppDispatch();
  const closeModal = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
  };
  return (
    <div
      className={styles.closeBtn}
      onClick={closeModal}
    >
      <Image
        src={images.announcement_close_btn}
        className='btn'
        alt='close-btn'
        fill
        sizes='100%'
      />
    </div>
  );
});

CloseBtn.displayName = 'CloseBtn';

export default VersionComponent;
