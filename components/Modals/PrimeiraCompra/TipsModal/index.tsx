import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type TipsModalProps = {
  CheckModal: () => void;
  setIsModalOn: Dispatch<SetStateAction<boolean>>;
};

const TipsModal: FC<TipsModalProps> = ({ CheckModal, setIsModalOn }) => {
  const locale = useAppSelector((state) => state.appData.language);
  const t = useTranslations().firstRecharge;

  const renderTipsContent = () => (
    <div className={styles.contentWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.contentItem}>
          <div className={styles.tipLabel}>
            <p>{t.tips.fLabel}:</p>
          </div>
          <div className={styles.tipDescription}>
            <p>{t.tips.fDesc}</p>
          </div>
        </div>
        <div
          className={styles.contentItem}
          data-lang={locale}
        >
          <div className={styles.tipLabel}>
            <p>{t.tips.sLabel}</p>
          </div>
          <div className={styles.tipDescription}>
            <p>{t.tips.sDesc}</p>
          </div>
        </div>
        <div className={styles.contentItem}>
          <div className={styles.tipLabel}>
            <p>{t.tips.tLabel}</p>
          </div>
          <div className={styles.tipDescription}>
            <p>{t.tips.tDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTips = () => (
    <div className={styles.primeiraTipsContainer}>
      <Image
        src={images.tips_bg}
        sizes='(max-width: 100vw) 100vw'
        alt='close-button'
        fill
        quality={100}
      />
      {renderTipsContent()}
    </div>
  );

  const renderCloseButton = () => (
    <div
      className={classNames(styles.closeButton, 'transition-all')}
      onClick={CheckModal}
    >
      <Image
        src={images.primeira_close}
        sizes='(max-width: 100vw) 100vw'
        alt='close-button'
        fill
        quality={100}
      />
    </div>
  );

  const renderTipsButton = () => (
    <div
      className={classNames(styles.tipsButton, 'transition-all')}
      onClick={() => setIsModalOn((prev) => !prev)}
    >
      <Image
        src={images.primeira_tips}
        sizes='(max-width: 100vw) 100vw'
        alt='tips-button'
        fill
        quality={100}
      />
    </div>
  );

  return (
    <div className={styles.tipsOuterContainer}>
      {renderTips()}
      {renderCloseButton()}
      {renderTipsButton()}
    </div>
  );
};

export default TipsModal;
