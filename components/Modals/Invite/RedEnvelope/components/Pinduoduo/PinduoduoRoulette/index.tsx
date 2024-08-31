import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { GameInviterData } from '@/constants/types';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import CloseButton from '@/components/Customs/CloseButton';
import coins from '@/public/assets/commons/envelope/coins.png';
import priceTag from '@/public/assets/commons/envelope/priceTag.png';
import rouletteBgLight from '@/public/assets/commons/envelope/rouletteBgLight.png';
import rouletteLight from '@/public/assets/commons/envelope/rouletteLight.png';
import selectedGlow from '@/public/assets/commons/envelope/selectedGlow.png';
import selectedWheel from '@/public/assets/commons/envelope/selectedWheel.png';
import spinButton from '@/public/assets/commons/envelope/spinButton.png';
import { useAppSelector } from '@/store';
import { isVivoBrowser } from '@/utils/helpers';
import { useTranslations } from '@/hooks/useTranslations';
import ErrorModal from '../../ErrorModal';
import Spin from './Spin';
import styles from './index.module.scss';

type TProps = {
  showWon: boolean;
  isLoading: boolean;
  earnedPoints: number;
  handlePlayButton: () => void;
  isSpinning: boolean;
  gameInviterData: GameInviterData | null;
  handleClose?: () => void;
  showErrorModal?: boolean;
  setShowErrorModal?: Dispatch<SetStateAction<boolean>>;
  errorMessage?: string;
  isModal?: boolean;
};

const PinduoduoRoulette: FC<TProps> = ({
  showWon,
  isLoading,
  earnedPoints,
  handlePlayButton,
  isSpinning,
  gameInviterData,
  handleClose,
  showErrorModal,
  setShowErrorModal,
  errorMessage,
  isModal,
}) => {
  const { userInfo } = useAppSelector((state) => state.userData);
  const { fourthModal } = useAppSelector((state) => state.appData);
  const pathname = usePathname();
  const t = useTranslations().affiliate;
  const [isHide, setIsHide] = useState(true);

  useEffect(() => {
    if (fourthModal === DATA_MODAL.PINDUODUO && !isModal) {
      setTimeout(() => {
        setIsHide(false);
      }, 2500);
    } else {
      setIsHide(false);
    }
  }, []);

  return (
    <div
      className={classNames(styles.container, {
        [styles.isAnimate]: pathname.includes('invite') && isModal,
        [styles.isHide]: isHide && !isModal,
      })}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.isVivoBrowser]: isVivoBrowser(),
        })}
      >
        {showWon && (
          <Image
            src={rouletteBgLight}
            alt='rouletteLight'
            className={styles.rouletteBgLight}
          />
        )}

        <Spin isLoading={isLoading} />

        {showWon && (
          <div className={styles.rouletteSelected}>
            <Image
              src={selectedWheel}
              alt='rouletteSelected'
              className={styles.selectedWheel}
            />
            <Image
              src={selectedGlow}
              alt='selectedGlow'
              className={styles.selectedGlow}
            />
          </div>
        )}

        <Image
          src={rouletteLight}
          alt='rouletteLight'
          className={styles.rouletteImg}
        />

        {showWon && (
          <div className={styles.priceTag}>
            <Image
              src={priceTag}
              alt='priceTag'
            />
            <h1>{earnedPoints || 0}</h1>
          </div>
        )}

        <button
          className={styles.spinButton}
          onClick={handlePlayButton}
          disabled={isSpinning}
        >
          <Image
            src={spinButton}
            alt='spinButton'
          />
          <h1>{gameInviterData?.playCount || '0'}</h1>
          <h2>{t.spin}</h2>
        </button>

        {!userInfo.isNewUser && isModal && (
          <CloseButton
            onClick={handleClose}
            className={styles.backButton}
          />
        )}

        {isModal && (
          <Image
            src={coins}
            alt='coins'
            className={styles.coins}
          />
        )}

        <h3>{t.tapToSpin}</h3>
      </div>

      <AnimatePresence>
        {showErrorModal && isModal && (
          <ErrorModal
            showModal={showErrorModal}
            closeModal={() => setShowErrorModal && setShowErrorModal(false)}
            errorMessage={errorMessage || ''}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PinduoduoRoulette;
