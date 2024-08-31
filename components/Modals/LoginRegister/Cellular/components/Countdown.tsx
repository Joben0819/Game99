import Image from 'next/image';
import { Dispatch, FC, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

type TCountdown = FC<
  Readonly<{
    disabled: boolean;
    isCounting: boolean;
    setDisabled: Dispatch<SetStateAction<boolean>>;
    setIsCounting: Dispatch<SetStateAction<boolean>>;
    onClick: MouseEventHandler<HTMLDivElement>;
  }>
>;

export const Countdown: TCountdown = ({ disabled, isCounting, setDisabled, setIsCounting, onClick }) => {
  const t = useTranslations().login;
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (isCounting && seconds > 0) {
      setDisabled(true);
      const timerId = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
    if (seconds === 0) {
      setDisabled(false);
      setIsCounting(false);
      setSeconds(60);
    }
  }, [isCounting, seconds]);

  return (
    <motion.div
      whileTap={!disabled ? { scale: 0.9 } : {}}
      className={classNames(styles.btnOtp, {
        [styles['btnOtp--disabled']]: disabled
      })}
      onClick={onClick}
    >
      <span className={styles.seconds}>{isCounting ? `${seconds}s` : t.sendCode}</span>
      <Image
        style={{ zIndex: '-1' }}
        src={images.btn_otp}
        alt='btnOtp'
        sizes='20vw'
        fill
      />
    </motion.div>
  );
};
