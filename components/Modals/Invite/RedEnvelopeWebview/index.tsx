import { useDispatch } from 'react-redux';
import { setPageLoad } from '@/reducers/appData';
import { useRouter } from 'next-nprogress-bar';
import { isLoggedIn } from '@/utils/helpers';
import MainScreen from './MainScreen';
import styles from './index.module.scss';
import { useEffect } from 'react';

const RedEnvelope = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {dispatch(setPageLoad(false))};
  }, [])

  const renderContent = () => {
    if (!isLoggedIn()) {
      dispatch(setPageLoad(true));
      router.push('/');
    }
    return <MainScreen />;
  };

  return <div className={styles.contentInfo}>{renderContent()}</div>;
};

export default RedEnvelope;
