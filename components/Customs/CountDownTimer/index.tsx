import { FC, useEffect, useState } from 'react';
import { DEFAULT } from '@/constants/enums';
// import { time } from 'console';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Jakarta');

type CountdownTimerProps = {
  validUntil: number;
  onCountdownEnd?: () => void;
};

const CountdownTimer: FC<CountdownTimerProps> = ({ validUntil, onCountdownEnd }) => {
  const [countdown, setCountdown] = useState<string>(DEFAULT.TIME);
  let timerInterval: ReturnType<typeof setInterval>;

  useEffect(() => {
    if (validUntil) {
      let hour;
      let minutes;
      let seconds;
      let timer = Number(validUntil);
      timerInterval = setInterval(() => {
        hour = Math.floor(timer / 60 / 60);
        minutes = Math.floor((timer / 60) % 60);
        seconds = Math.floor(timer % 60);

        hour = hour < 10 ? `0${hour}` : hour;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        const countdown = `${hour}:${minutes}:${seconds}`;
        setCountdown(countdown);

        timer -= 1;

        if (timer < 0) {
          setCountdown(DEFAULT.TIME);
          clearInterval(timerInterval);
          if (onCountdownEnd) {
            setTimeout(onCountdownEnd, 1000);
          }
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [validUntil]);

  return <>{countdown}</>;
};

export default CountdownTimer;
