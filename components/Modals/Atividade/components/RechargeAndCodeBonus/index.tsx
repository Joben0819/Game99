import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { MODAL_BG_ANIMATION } from '@/constants/app';
import { APK_EVENT, DEFAULT } from '@/constants/enums';
import classNames from 'classnames';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { AnimatePresence, motion } from 'framer-motion';
import { clamp, debounce } from 'lodash-es';
import CountdownTimer from '@/components/Customs/CountDownTimer';
import LoadingIcon from '@/components/Customs/LoadingIcon';
import { useAppSelector } from '@/store';
import { moneyFormat, triggerApkEvent } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import PriceModal from '../coinRoulette/components/PriceModal';
import { useClaimDepositBonusMutation, useGetDepositBonusQuery } from './rechargeBonus.rtk';
import styles from './styles.module.scss';

type RechargeAndCodeBonusProps = {
  isWebView?: boolean;
};

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Jakarta');

const RechargeAndCodeBonus: FC<RechargeAndCodeBonusProps> = ({ isWebView }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().rechargeBonus;
  const [winData, setWinData] = useState('');
  const [showWinModal, setShowWinModal] = useState(false);
  const { resetInternetStatus } = useWithDispatch();
  const [showTerms, setShowTerms] = useState(false);
  const [rotation, setRotation] = useState(0);
  const { data: bonusDetails, refetch: refetchDepositBonus } = useGetDepositBonusQuery(null, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [claimDepositBonus] = useClaimDepositBonusMutation();

  useEffect(() => {
    resetInternetStatus();
  }, []);

  if (!bonusDetails) return <LoadingIcon />;

  const bonusGoal = bonusDetails.bonusGoal;
  const hasRecharge = bonusDetails.rechargeAmount > 0;
  const isValidBetAmount = bonusDetails.betAmount > 0;
  const returnPercentage = bonusDetails.returnPercentage.toFixed(0);
  const isAbleToClaim = isValidBetAmount ? bonusDetails.accumulatedBets >= bonusDetails.betAmount : false;
  const claimProgress = isValidBetAmount
    ? clamp(bonusDetails.accumulatedBets / bonusDetails.betAmount, 0, 1) * 100 - 100
    : -100;

  const claimBonus = async () => {
    const { code, data } = await claimDepositBonus().unwrap();
    if (code === 200) {
      setWinData(data);
      setShowWinModal(true);
      window.parent.postMessage('FIRST DEPO CLAIM', '*');
      if (isWebView) {
        triggerApkEvent(APK_EVENT.SPIN, ['includeIOS', 'skipStringify']);
      }
    }
  };

  const handleShowTerms = () => setShowTerms((prevVal) => !prevVal);

  const upReturn = t.upReturn
    .replace('{bonusGoal}', moneyFormat(bonusGoal, false))
    .replace('{returnPercentage}', returnPercentage);

  const renderTermsAndCondition = () => {
    if (!bonusDetails.termsConditions) return <p>{t.noTermsAvailable}</p>;

    return (
      <>
        <h1>{t.termsAndCondition}</h1>
        <div
          className={styles.termsAndCondition__paragraph}
          dangerouslySetInnerHTML={{ __html: `<p>${bonusDetails.termsConditions.replaceAll('\\n', '<br>')}</p>` }}
        ></div>
      </>
    );
  };

  const onClick = () => {
    isAbleToClaim && bonusDetails.claimable && claimBonus();
  };

  const refetchDeposit = debounce(() => {
    setRotation((prev) => prev + 360);
    refetchDepositBonus();
  }, 500);

  const debouncedHandleInput = debounce(onClick, 500);

  return (
    <div
      data-lang={locale}
      className={classNames(styles.rechargeBonus, { [styles.isWebView]: isWebView })}
    >
      <AnimatePresence>
        {showTerms && (
          <motion.div
            variants={MODAL_BG_ANIMATION}
            exit='exit'
            className={classNames(styles.termsAndCondition, {
              [styles['termsAndCondition--show']]: showTerms,
            })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeInOut', delay: 0.6 } }}
              exit={{ scale: 0 }}
              className={classNames(styles.termsAndCondition__modalContainer, {
                [styles['termsAndCondition__modalContainer--show']]: showTerms,
              })}
            >
              <div
                className={styles.termsAndCondition__modalCloseButton}
                onClick={handleShowTerms}
              >
                <Image
                  src={images.modal_close_btn}
                  width={108}
                  height={108}
                  alt='close button'
                />
              </div>
              <div className={styles.termsAndCondition__modalContent}>{renderTermsAndCondition()}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <span
        className={styles.heading}
        data-textafter={upReturn}
      >
        {upReturn}
      </span>
      <div className={styles.rechargeBonus__content}>
        <div className={styles.rechargeBonus__countdown}>
          {hasRecharge && (
            <div className={styles.rechargeBonus__clock}>
              <Image
                src={images.clock}
                alt='clock'
                sizes='(max-width: 100vw) 100vw'
                fill
                quality={100}
              />
            </div>
          )}
          <span>
            {hasRecharge ? (
              !bonusDetails.validUntil ? (
                DEFAULT.TIME
              ) : (
                <CountdownTimer
                  onCountdownEnd={refetchDepositBonus}
                  validUntil={bonusDetails.validUntil}
                />
              )
            ) : (
              t.noRechargeYet
            )}
          </span>
        </div>

        <div className={styles.rechargeBonus__frozenBonus}>
          <span>{t.frozenBonus}</span>
          <div>
            <Image
              src={images.rp_icon}
              alt='rp Logo'
              width={23}
              height={23}
              className={styles.rechargeBonus__rpLogo}
            />
            <span data-textafter={bonusDetails.bonus}>{bonusDetails.bonus}</span>
          </div>
        </div>

        <div className={styles.rechargeBonus__validBet}>
          <span>{t.validBetAmount}</span>
          <div>
            <div
              className={styles.progressBar}
              style={{ left: `${claimProgress}%` }}
            >
              <Image
                src={images.bar}
                alt='progress bar'
                className={styles.rechargeBonus__rpLogo}
                sizes='(max-width: 100vw) 100vw'
                fill
              />
            </div>
            <span>{`${bonusDetails.accumulatedBets}/${bonusDetails.betAmount}`}</span>
          </div>
        </div>
        <button
          onClick={() => { debouncedHandleInput() }}
          className={classNames(styles.rechargeBonus__collectButton, {
            [styles['rechargeBonus__collectButton--active']]: isAbleToClaim,
          })}
          disabled={!isAbleToClaim}
        >
          <p>{t.collect}</p>
        </button>
      </div>
      <div className={styles.termsAndCondition__linkContainer}>
        <span
          className={styles.termsAndCondition__link}
          onClick={handleShowTerms}
        >
          {t.termsAndCondition}
        </span>
      </div>
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={() => { refetchDeposit() }}
        className={classNames(styles.reload, {
          [styles.isWebView]: isWebView,
        })}
        initial={{ rotateZ: rotation }}
        animate={{ rotateZ: rotation, transition: { duration: 0.5 } }}
      >
        <Image
          src={images.refresh_btn}
          alt='refresh'
          sizes='(max-width: 100vw) 100vw'
          fill
        />
      </motion.div>
      <AnimatePresence>
        {showWinModal && (
          <PriceModal
            price={+winData}
            priceIcon='giftbox'
            handleClose={() => { setShowWinModal(false) }}
            isWebView={isWebView}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RechargeAndCodeBonus;
