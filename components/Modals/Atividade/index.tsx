import { useEffect } from 'react';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import DisplayActivity from './components/index';
import styles from './index.module.scss';

const Activities = () => {
  const { getAccountBalance } = useWithDispatch();

  useEffect(() => {
    const receivedMessage = (e: MessageEvent) => {
      if (e.data === 'FIRST DEPO CLAIM' || e.data === 'ROULETTE WIN') {
        getAccountBalance();
      }
    };

    window.addEventListener('message', receivedMessage);
    return () => {
      window.removeEventListener('message', receivedMessage);
    };
  }, []);

  return (
    <div className={styles.activitiesWrapper}>
      <div className={styles.modal}>
        <DisplayActivity />
      </div>
    </div>
  );
};

export default Activities;
