import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { TRouletteConfig } from '@/services/response-type';
import classNames from 'classnames';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import CountdownTimer from '@/components/Customs/CountDownTimer';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './RouletteInfo.module.scss';

type RouletteInfoProps = {
  isWebView?: boolean;
  config: TRouletteConfig;
  handleSpin: () => void;
  setIsSpinning: Dispatch<SetStateAction<boolean>>;
  handleTermModal: () => void;
  refetch: () => void;
};

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Jakarta');

const RouletteInfo: FC<RouletteInfoProps> = ({
  isWebView,
  config,
  handleSpin,
  setIsSpinning,
  handleTermModal,
  refetch,
}) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations();
  const { minMoney, maxMoney, claimable, validUntil } = config;
  const [rotation, setRotation] = useState(0);

  const handleClick = debounce(() => {
    if (!claimable) return;
    setIsSpinning(true);
    handleSpin();
  }, 300);

  const refetchRoulette = debounce(() => {
    setRotation((prev) => prev + 360);
    refetch();
  }, 500);

  return (
    <div
      className={classNames([styles.info], { [styles.webview]: isWebView })}
      data-lang={locale}
    >
      <div className={styles.title}>
        <span>{t.spin.title}</span>
      </div>
      <div className={styles.details}>
        <p data-textafter={t.spin.description}>{t.spin.description}</p>
        <p>{t.spin.subtext}</p>
      </div>
      <div className={styles.lines}></div>
      <div className={styles.moneyRange}>
        <span>
          {moneyFormat(minMoney, true)} - {moneyFormat(maxMoney, true)}
        </span>
      </div>
      <div
        className={classNames(styles.time, { [styles.claimed]: !claimable })}
        onClick={handleClick}
      >
        <span>
          {claimable ? (
            'Claim'
          ) : validUntil ? (
            <CountdownTimer
              validUntil={validUntil}
              onCountdownEnd={refetch}
            />
          ) : (
            t.spin.bonusReceived
          )}
        </span>
      </div>
      {!!config.termsConditions && (
        <p
          className={classNames(styles.termsAndCondition, {
            [styles.isWebView]: isWebView,
          })}
          onClick={handleTermModal}
          data-textafter={t.rechargeBonus.termsAndCondition}
        >
          {t.rechargeBonus.termsAndCondition}
        </p>
      )}

      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          refetchRoulette();
        }}
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
    </div>
  );
};

export default RouletteInfo;
