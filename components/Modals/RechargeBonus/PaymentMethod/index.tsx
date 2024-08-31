import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MODAL_BG_ANIMATION, MODAL_CONTENT_ANIMATION } from '@/constants/app';
import { onlineRecharge } from '@/services/api';
import { ConfigRechargeProps, TOnlineRecharge } from '@/services/types';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type PaymentMethodProps = {
  rechargeConfig: ConfigRechargeProps | null;
  handleClose: () => void;
  setIsPopUpShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({ rechargeConfig, handleClose, setIsPopUpShow }) => {
  const t = useTranslations();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(selectedIndex == null);

  const handleSelectMethod = (index: number) => {
    setSelectedIndex(index);
    setIsDisabled(false);
  };

  const handleConfirm = () => {
    if (rechargeConfig?.payTypeList && selectedIndex !== null) {
      setIsDisabled(true);
      const selectedMethod = rechargeConfig?.payTypeList[selectedIndex];

      const rechargeData: TOnlineRecharge = {
        channelId: selectedMethod.id,
        money: rechargeConfig?.rechargeMoney,
        rechargeActivityType: rechargeConfig?.activityType,
        realIp: localStorage.getItem('ip'),
      };

      onlineRecharge(rechargeData)
        .then((res) => {
          setTimeout(() => {
            if (res?.data?.code === 200) {
              const data = res?.data?.data;
              window.open(data, '_blank');
              toast.success(res?.data?.msg ?? 'Success');
              handleClose();
            } else {
              toast.error(res?.data?.msg ?? 'Error');
            }
            setIsDisabled(false);
          }, 500);
        })
        .catch((err) => {
          console.error(err);
          setIsDisabled(false);
        });
    } else {
      toast.error(t.toasts.selectPaymentMethod);
    }
  };

  return (
    <motion.div
      variants={MODAL_BG_ANIMATION}
      initial='hidden'
      animate='visible'
      exit='exit'
      className={styles.popupContainer}
    >
      <motion.div
        variants={MODAL_CONTENT_ANIMATION}
        initial='hidden'
        animate='visible'
        exit='exit'
        className={styles.content}
      >
        <div className={styles.popupWrapper}>
          <Image
            src={images.redCloseBtn}
            alt='Close button'
            width={80}
            height={80}
            className={styles.closePopup}
            quality={100}
            onClick={() => setIsPopUpShow(false)}
          />

          <div className={styles.title}>{t.rechargeBonus.paymentMethod}</div>

          <div className={styles.icons}>
            {rechargeConfig?.payTypeList?.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleSelectMethod(index)}
                className={classNames(styles.iconWrapper, {
                  [styles.isActive]: selectedIndex === index,
                })}
              >
                <Image
                  src={item.icon_url}
                  alt={item.name}
                  width={100}
                  height={100}
                  quality={100}
                />
              </div>
            ))}
          </div>

          <button
            className={classNames(styles.btnConfirmTopup, {
              [styles.disabled]: isDisabled,
            })}
            onClick={handleConfirm}
          >
            {t.rechargeBonus.confirm}
          </button>
        </div>
        <Image
          src={images.RechargePopupEffect}
          alt='Pop Effect'
          width={979}
          height={360}
          className={styles.effect}
          quality={100}
        />
      </motion.div>
    </motion.div>
  );
};

export default PaymentMethod;
