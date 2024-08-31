import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setIsPopup, setPageLoad } from '@/reducers/appData';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import { useAppDispatch, useAppSelector } from '@/store';
import { isLoggedIn, moneyFormat } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './index.module.scss';

const UserBalanceInfo = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations().profile;
  const { userInfo, userBalance } = useAppSelector((state) => state.userData);
  const { isPopupOpen, prevPage } = useAppSelector((state) => state.appData);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [prevBonusMoney, setPrevBonusMoney] = useState(userInfo.bonusMoney);
  const { getAccountBalance } = useWithDispatch();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setPrevBonusMoney(userInfo.bonusMoney);

    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  useEffect(() => {
    if (userInfo.bonusMoney !== undefined) {
      if (userInfo.bonusMoney !== prevBonusMoney) {
        setPrevBonusMoney(userInfo.bonusMoney);
        if (prevPage !== 'loginRegister-page') {
          dispatch(setIsPopup(true));
        }
      }
    }
  }, [userInfo.bonusMoney, prevBonusMoney, prevPage]);

  useEffect(() => {
    let spinTimer = setTimeout(() => setIsRefreshed(false), 500);
    return () => {
      clearTimeout(spinTimer);
    };
  }, [isRefreshed]);

  const handleClick = (route?: string) => {
    if (!isLoggedIn()) {
      dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
      return;
    }
    if (route) {
      dispatch(setPageLoad(true));
      router.push(route);
      return;
    }
    dispatch(setActiveModal(DATA_MODAL.VIP));
  };

  const renderBalanceTooltip = () => {
    return (
      <div className={styles.balanceIcon}>
        <Image
          sizes='10vw'
          alt='Diamond'
          src={staticImport.diamond}
          placeholder='blur'
          quality={100}
        />
        {isPopupOpen && (
          <div
            className={styles.balanceTooltip}
            onClick={() => {
              dispatch(setIsPopup(false));
              router.push('/recharge');
            }}
          >
            <div className={styles.tooltipContents}>{t.tooltip}</div>
          </div>
        )}
      </div>
    );
  };

  const handleRefreshBalance = debounce(() => {
    if (isLoggedIn()) {
      setRotation((prev) => prev + 360);
      getAccountBalance();
    } else {
      dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
    }
  }, 500);

  return (
    <div className={styles.userBalanceInfoWrapper}>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={styles.avatarVIP}
        onClick={() => handleClick('/personal-center')}
      >
        <div className={styles.avatarBorder} />
        <div className={styles.avatarImg}>
          <Image
            sizes='20vw'
            alt='User'
            src={userInfo.headImg || staticImport.user_icon}
            fill
            quality={100}
          />
        </div>

        {userInfo?.id !== '' && isLoggedIn() && (
          <div className={styles.vipImg}>
            <Image
              alt='Vip level'
              src={images[`vip_${userInfo?.vip}`] ?? staticImport.game_item_placeholder}
              width={50}
              height={50}
              quality={100}
            />
          </div>
        )}
      </motion.div>

      <div className={styles.balances}>
        <span
          className={styles.id}
          data-lang={locale}
        >
          {userInfo.id ? `ID: ${userInfo?.username ?? userInfo?.nickName?.split(' ')[0]}` : t.notLoggedIn}{' '}
        </span>
        <div className={styles.balanceContainer}>
          <div className={styles.balanceIcon}>
            <Image
              sizes='10vw'
              alt='Balance'
              src={staticImport.balance_icon}
              placeholder='blur'
              quality={100}
            />
          </div>
          <span>{userBalance?.balance ? moneyFormat(+userBalance?.balance) : '0'}</span>

          <motion.div
            initial={{ rotateZ: rotation }}
            animate={{ rotateZ: rotation, transition: { duration: 0.5 } }}
            whileTap={{ scale: 0.9 }}
            className={classNames(styles.addBtnImg, styles.refreshBtn)}
            onClick={handleRefreshBalance}
          >
            <Image
              sizes='10vw'
              alt='Add'
              src={images.header_refresh_btn}
              fill
              quality={100}
            />
          </motion.div>
        </div>
        <div className={styles.balanceContainer}>
          {renderBalanceTooltip()}
          <span>{userBalance?.bonusMoney ? moneyFormat(+userBalance?.bonusMoney) : '0'}</span>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={styles.addBtnImg}
            onClick={() => handleClick()}
          >
            <Image
              sizes='10vw'
              alt='Add'
              src={staticImport.add_icon}
              placeholder='blur'
              quality={100}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserBalanceInfo;
