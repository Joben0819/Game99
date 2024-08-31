import Image from 'next/image';
import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setPrevPage } from '@/reducers/appData';
import { getConfigRechargeBonus } from '@/services/api';
import { ConfigRechargeProps } from '@/services/types';
import { AnimatePresence } from 'framer-motion';
// import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import PaymentMethod from './PaymentMethod';
import styles from './index.module.scss';
import CountdownClock from './CountdownClock';

const RechargeBonus = () => {
  const dispatch = useDispatch();
  const [fetchedData, setFetchedData] = useState<ConfigRechargeProps | null>(null);
  const [isPopUpShow, setIsPopUpShow] = useState<boolean>(false);
  // const prevPage = useAppSelector((state) => state.appData.prevPage);

  useEffect(() => {
    if(localStorage.getItem('rechargeBonusData')) {
      setFetchedData(JSON.parse(localStorage.getItem('rechargeBonusData') || '{}'));
    } else {
      const fetchData = async () => {
        try {
          const response = await getConfigRechargeBonus();
          if (!response.data.data) {
            handleClose();
          }
          setFetchedData(response.data.data);
          localStorage.setItem('rechargeBonusData', JSON.stringify(response.data.data));
        } catch (error) {
          console.error('Error fetching data:', error);
          handleClose();
        }
      };

      fetchData();
    }
  }, []);

  const handleClose = () => {
    dispatch(setPrevPage('recharge-bonus-page'));
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
  };

  if (!fetchedData) return null;

  return (
    <>
      <div className={styles.mainContainer}>
        <Image
          src={images.redCloseBtn}
          alt={'Close button'}
          width={110}
          height={110}
          className={styles.backButton}
          quality={100}
          onClick={handleClose}
        />
        <div className={styles.wrapperContainer}>
          <div className={styles.titleWrapper}>
            <p
              className={styles.title}
              data-textafter={fetchedData?.title || 'BONUS TOP-UP BARU'}
            >
              {fetchedData?.title || 'BONUS TOP-UP BARU'}
            </p>
          </div>
          <CountdownClock />
          <div className={styles.bottomContainer}>
            <div className={styles.topContent}>
              <Image
                className={styles.rechargeBg}
                src={images.coins}
                alt='Coin'
                width={100}
                height={100}
              />
              <span data-textafter={moneyFormat(fetchedData?.awardMoney) || 0}>
                {moneyFormat(fetchedData?.awardMoney) || 0}
              </span>
            </div>
            <div className={styles.bottomContent}>
              <div
                className={styles.bottomWrapper}
                onClick={() => setIsPopUpShow(true)}
              >
                <span className={styles.discounted}>{moneyFormat(fetchedData?.awardMoney || 0)}</span>
                <span className={styles.rechargeBtn}>{moneyFormat(fetchedData?.rechargeMoney || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isPopUpShow && (
            <PaymentMethod
              rechargeConfig={fetchedData}
              setIsPopUpShow={setIsPopUpShow}
              handleClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default RechargeBonus;
