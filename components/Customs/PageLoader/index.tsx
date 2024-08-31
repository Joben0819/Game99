'use client';

import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { INTERNET_TIMEOUT } from '@/constants/app';
import { setSlowInternet } from '@/reducers/appData';
import { useAppSelector } from '@/store';
import LoadingIcon from '../LoadingIcon';
import styles from './index.module.scss';

const PageLoader = () => {
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(0);
  const { isPageLoading } = useAppSelector((state) => state.appData);
  
  useEffect(() => {
    return () => {dispatch(setSlowInternet(false))};
  }, [])

  useEffect(() => {
    const countdownTimer = isPageLoading ? setInterval(() => setCountdown((prevCountdown) => prevCountdown + 1), 1000) : undefined;

    if (isPageLoading) {
      if (countdown >= INTERNET_TIMEOUT) {
        dispatch(setSlowInternet(true));
      } else {
        dispatch(setSlowInternet(false));
      }
    } else {
      setCountdown(0);
    }
    return () => {
      dispatch(setSlowInternet(false));
      clearInterval(countdownTimer);
    };
  }, [isPageLoading, countdown, dispatch]);

  return (
    <div
      className={classNames(styles.loaderWrapper, {
        [styles['loaderWrapper--show']]: isPageLoading
      })}
    >
      <LoadingIcon />
    </div>
  );
};

export default PageLoader;
