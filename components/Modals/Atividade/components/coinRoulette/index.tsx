import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { isIOS } from 'react-device-detect';
import toast from 'react-hot-toast';
import { APK_EVENT } from '@/constants/enums';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import { triggerApkEvent } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import PriceModal from './components/PriceModal';
import RouletteInfo from './components/RouletteInfo';
import { TermsModal } from './components/TermsModal';
import { useGetRouletteConfigQuery, useSpinRouletteMutation } from './roulette.rtk';
import styles from './styles.module.scss';

export type WinningIcons = 'bag' | 'envelope' | 'giftbox';

type CoinRouletteProps = {
  isWebView?: boolean;
};

const CoinRoulette: FC<CoinRouletteProps> = ({ isWebView }) => {
  const { resetInternetStatus } = useWithDispatch();
  const [showPrice, setShowPrice] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningAngle, setWinningAngle] = useState(0);
  const [winningIcon, setWinningIcon] = useState<WinningIcons>();
  const [prize, setPrize] = useState(0);
  const [winningId, setWinningId] = useState(0);
  const initialConfigState = {
    minMoney: 0,
    maxMoney: 0,
    claimable: false,
    validUntil: 0,
    termsConditions: '',
  };
  const rotationDeg = -1080;
  const segmentAngle = 360 / 8;
  const { data: rouletteConfig, refetch } = useGetRouletteConfigQuery(null, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [spin] = useSpinRouletteMutation();
  const t = useTranslations().affiliate;

  useEffect(() => {
    resetInternetStatus();
  }, [showPrice]);

  useEffect(() => {
    if (isSpinning) {
      setWinningAngle((prev) => prev - rotationDeg - (winningId ? winningId : 0) * segmentAngle);
    }
  }, [isSpinning]);

  useEffect(() => {
    switch (winningId) {
      case 0:
      case 3:
      case 5:
        setWinningIcon('giftbox');
        break;
      case 2:
      case 4:
      case 7:
        setWinningIcon('bag');
        break;
      default:
        setWinningIcon('envelope');
    }
  }, [winningId]);

  const handleClick = async () => {
    if (!rouletteConfig?.claimable) return;
    const { data, code, msg } = await spin().unwrap();
    if (code !== 200) return toast.error(msg, { id: 'error' });
    setIsSpinning(true);
    setPrize(data);
    setWinningId(Math.round(Math.random() * 8));
  };

  const throttledClick = debounce(handleClick, 300);

  const handleAnimationComplete = () => {
    if (winningAngle != 0) {
      setIsSpinning(false);
      setShowPrice(true);
      window.parent.postMessage('ROULETTE WIN', '*');
      triggerApkEvent(APK_EVENT.SPIN, ['includeIOS', 'skipStringify']);
    }
  };

  const handleTermModal = () => {
    setShowTerms((prev) => !prev);
  };

  return (
    <div className={styles.frameContainer}>
      <div className={classNames([styles.inner], { [styles.webview]: isWebView, [styles.iphone]: isIOS })}>
        <div className={styles.rouletteContainer}>
          <div className={styles.roulette}>
            <motion.div
              animate={{ rotate: winningAngle }}
              onAnimationComplete={() => isSpinning && handleAnimationComplete()}
              transition={{ duration: 3 }}
              className={styles.rouletteOptions}
            >
              <Image
                src={images.roulette_wheel_with_icons}
                alt='roulette-BG'
                width={1341}
                height={1347}
              />
              <div className={styles.segments} />
            </motion.div>
            <button
              className={classNames(styles.roulettePointer, {
                [styles.isWebView]: isWebView,
              })}
              // onClick={throttledClick}
              // disabled={isSpinning}
            >
              <Image
                src={images.roulette_pointer}
                alt='roulette-pointer'
                sizes='20vw'
                fill
              />
              <span data-textafter={t.spin}>{t.spin}</span>
            </button>
          </div>
        </div>
        <RouletteInfo
          config={rouletteConfig || initialConfigState}
          isWebView={isWebView}
          handleSpin={throttledClick}
          setIsSpinning={setIsSpinning}
          handleTermModal={handleTermModal}
          refetch={refetch}
        />
        {showTerms && (
          <TermsModal
            termsContent={rouletteConfig?.termsConditions ?? ''}
            showTerms
            handleTermModal={handleTermModal}
            isWebView={isWebView}
          />
        )}
        <AnimatePresence>
          {showPrice && (
            <PriceModal
              priceIcon={winningIcon}
              price={prize}
              handleClose={() => {
                setShowPrice(false);
              }}
              isWebView={isWebView}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoinRoulette;
