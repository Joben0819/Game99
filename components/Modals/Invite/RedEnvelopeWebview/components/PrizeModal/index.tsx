import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import SVGA from '../SVGA';
import styles from './index.module.scss';

const PrizeModal = ({
  showPrizeModal,
  points,
  webView = false,
}: {
  showPrizeModal: boolean;
  points?: string;
  webView?: boolean;
}) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().affiliate;
  const [showGlassDome, setShowGlassDome] = useState(false);
  const [hideModal, setHideModal] = useState(showPrizeModal);

  useEffect(() => {
    setShowGlassDome(true);
    const closeModalTimeout = setTimeout(() => {
      setHideModal(false);
    }, 7000);

    return () => clearTimeout(closeModalTimeout);
  }, []);

  const handleHideGlassDome = useCallback(() => {
    const hideGlassDomeTimeout = setTimeout(() => {
      setShowGlassDome(false);
    }, 1500);

    return () => clearTimeout(hideGlassDomeTimeout);
  }, []);

  const renderWinningPrizeModalContent = () => (
    <div
      className={classNames(styles.svgaImgContainer, {
        [styles.hide]: !hideModal,
      })}
    >
      <div className={styles.winningPrizeTopText}>
        <h2 data-lang={locale}>
          {t.modalContent.invitePerson}
          <span className={styles.yellowText}>{`${t.modalContent.withdrawYuan} ${moneyFormat(+points!, false)}`}</span>
        </h2>
        <h2 data-lang={locale}>{t.modalContent.congratulation}</h2>
      </div>
      <div
        className={classNames(styles.blueWhiteBox, {
          [styles.webView]: webView,
        })}
      >
        <div
          className={classNames(styles.blueCircleFlagContainer, {
            [styles.webView]: webView,
          })}
        >
          <Image
            src={images.gopay_xlarge_icon}
            width={30}
            height={30}
            alt='blue circle flag'
          />
        </div>
        <span>{moneyFormat(+points!, false)}</span>
      </div>
    </div>
  );

  return (
    <div
      className={classNames(styles.prizeModalWrapper, {
        [styles.hide]: !showPrizeModal,
        [styles.webView]: webView,
      })}
    >
      <div className={styles.modalContainer}>
        <SVGA
          showSVGA={showGlassDome}
          svga={images.glass_dome_web}
          isSVGALoaded={() => handleHideGlassDome()}
        />
        {renderWinningPrizeModalContent()}
      </div>
    </div>
  );
};

export default PrizeModal;
