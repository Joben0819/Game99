import styles from '../index.module.scss';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';

const CountdownClock = () => {
  const t = useTranslations();
  const initialTime = 28800;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  useEffect(() => {
    const storedTime = localStorage.getItem('timer');
    if (storedTime) {
      setTimeLeft(parseInt(storedTime));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timer', timeLeft.toString());

    if (timeLeft <= 0) {
      setTimeLeft(initialTime);
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    return dayjs().startOf('day').second(seconds).format('HH:mm:ss');
  };

  return <div className={styles.countdownWrapper}>
  <Image
    src={images.countdownFrame}
    alt='countdown frame'
    width={151}
    height={83}
    className={styles.countdownFrame}
  />
  <span className={styles.timerTitle}>{t.rechargeBonus.timeLeft}</span>
  <div className={styles.content}>
    <Image
      src={images.countdownClock}
      alt='recharge clock'
      width={35}
      height={35}
      className={styles.countdownClock}
    />
    <span className={styles.clockTime}>{formatTime(timeLeft)}</span>
  </div>
</div>
};

export default CountdownClock;