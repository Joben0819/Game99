import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { setRspWithdrawInfo } from '@/reducers/paymentData';
import { setUserWithdrawPass } from '@/reducers/userData';
import { getBindCardList, verifyWithdrawalPassword, withdrawBank, withdrawPassSet } from '@/services/api';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from './index.module.scss';

const WithdrawalPassword = () => {
  const locale = useAppSelector((state) => state.appData.language);
  const dispatch = useDispatch();
  const t = useTranslations().withdraw;
  const { getAccountUserInfo } = useWithDispatch();
  const buttonLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '', '9', '0', ''];
  const pinIndex = [0, 1, 2, 3];
  const { userInfo } = useAppSelector((state) => state.userData);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const pinInfo = userInfo.hasWithdrawPass ? t.enterYourPin : t.setAndRememberYourPin;
  const [disabledButtons, setDisabledButtons] = useState<boolean>();
  const [deleteButton, setDeleteButton] = useState<boolean>(false);
  const [confirmButton, setConfirmButton] = useState<boolean>(false);
  const eyeImg = showPin ? images.opened_eye : images.closed_eye

  useEffect(() => {
    if (pin.length === 4) {
      setConfirmButton(true);
      setDeleteButton(true);
    } else if (pin.length < 4 && pin.length !== 0) {
      setDeleteButton(true);
      setConfirmButton(false);
    } else {
      setConfirmButton(false);
      setDeleteButton(false);
    }
  }, [pin]);

  const onCloseBtn = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    getAccountUserInfo();
  };

  const validateActiveButton = (index: number) => {
    if (index === 8) {
      return !deleteButton;
    } else if (index === 11) {
      return !confirmButton;
    }
  };

  const handleButtonClick = (label: string, index: number) => {
    if (index === 8) {
      setPin(pin.slice(0, -1));
    } else if (index === 11 && pin.length === 4) {
      setDisabledButtons(false);
      setWithdrawPassword(pin);
    } else if (pin.length < 4 && /^\d$/.test(label)) {
      setPin(pin + label);
    }
  };

  const Pins = () => (
    <div className={styles.pinWrapper}>
      {pinIndex.map((indx) => (
        <span
          key={indx}
          className={classNames(styles.pin, { [styles.hidePin]: !showPin })}
        >
          <span>{pin.charAt(indx) != '' && !showPin ? '*' : pin.charAt(indx)}</span>
        </span>
      ))}
    </div>
  );

  const NumpadKeys = () => (
    <div className={styles.buttonsWrapper}>
      {buttonLabels.map((label, index) => (
        <motion.div
          data-lang={locale}
          key={index}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleButtonClick(label, index)}
          className={classNames(styles.btn, {
              [styles['btn--disabled']]: disabledButtons || validateActiveButton(index),
          })}
        >
          <p>{label}</p>
        </motion.div>
      ))}
    </div>
  );

  const withdrawWithPass = () => {
    verifyWithdrawalPassword({ withdrawPass: pin }).then((res) => {
      if (res?.data?.code === 200) {
        getAccountUserInfo();
        dispatch(setUserWithdrawPass(userInfo.hasWithdrawPass));
        setTimeout(() => {
          withdrawBank({
            memberCardId: parseInt(sessionStorage.getItem('memberCardId')!, 10),
            withdrawMoney: parseInt(sessionStorage.getItem('withdrawAmount')!, 10),
            withdrawalPass: pin,
          }).then((result) => {
            getAccountUserInfo();
            if (result?.data?.code === 200) {
              toast.success(result?.data?.msg);
              sessionStorage.removeItem('memberCardId');
              sessionStorage.removeItem('withdrawAmount');
              getBindCardList().then((res) => {
                if (res?.data?.code == 200) {
                  dispatch(setRspWithdrawInfo(res?.data?.data?.rspWithdrawInfo));
                }
              });
            } else {
              toast.error(result?.data?.msg);
            }
          });
        }, 500);
        dispatch(setActiveModal(DATA_MODAL.CLOSE));
      } else {
        toast.error(res?.data?.msg);
        setPin('');
      }
    });
  };

  const setWithdrawPassword = (pin: string) => {
    if (disabledButtons) {
      return;
    }

    setDisabledButtons(true);
    if (!userInfo?.hasWithdrawPass) {
      withdrawPassSet({ boxPass: pin }).then((res) => {
        if (res?.data?.code === 200) {
          getAccountUserInfo();
          dispatch(setUserWithdrawPass(userInfo.hasWithdrawPass));
          withdrawWithPass();
        } else {
          toast.error(res?.data?.msg);
        }
      });
    } else {
      withdrawWithPass();
    }

    setTimeout(() => {
      setDisabledButtons(false);
    }, 1000);
  };

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContainer}>
        <div className={styles.bgContainer}>
          <Image
            src={images.withdraw_pass_bg}
            alt='bg'
            fill
            sizes='100%'
          />
        </div>
        <div className={styles.contents}>
          <HeaderTitle
            className={styles.title}
            text={t.withdrawPassModalTitle}
            size={22}
            transform={'uppercase'}
          />
          <div
            className={styles.closeBtn}
            onClick={onCloseBtn}
          />
          <span className={styles.note}>{pinInfo}</span>
          <span
            className={styles.eye}
            style={{ backgroundImage: `url(${eyeImg}` }}
            onClick={() => setShowPin(!showPin)}
          ></span>
          <Pins />
          <NumpadKeys />
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPassword;
