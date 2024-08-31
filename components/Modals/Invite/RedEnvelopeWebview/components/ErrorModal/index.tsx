import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { MODAL_BG_ANIMATION } from '@/constants/app';
import { APK_EVENT } from '@/constants/enums';
import classnames from 'classnames';
import { motion } from 'framer-motion';
import { triggerApkEvent } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type ErrorModalProps = {
  closeModal: () => void;
  showModal: boolean;
  webView?: boolean;
  errorMessage: string;
};

const ErrorModal: FC<ErrorModalProps> = ({ showModal, closeModal, webView, errorMessage }) => {
  const router = useRouter();
  const t = useTranslations().payment;
  const isSmallWebView = window.innerWidth < 450 && webView;

  const handleRechargeClick = () => {
    if (webView) {
      triggerApkEvent(APK_EVENT.RECHARGE, ['useAsJumpType', 'includeIOS']);
    } else {
      router.push('recharge');
      localStorage.setItem('prevModal', 'PINDUODUO');
    }
  };

  return (
    <motion.div
      className={classnames(styles.errorModal, {
        [styles['errorModal--show']]: showModal,
        [styles['errorModal--webview']]: webView,
        [styles['errorModal--isSmallWebView']]: isSmallWebView,
      })}
      variants={MODAL_BG_ANIMATION}
      exit='exit'
    >
      <motion.div
        className={styles.errorModal__container}
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            delay: 0.6,
            duration: 1,
          },
        }}
        exit={{
          scale: 0,
        }}
      >
        <div
          className={styles.errorModal__closeButton}
          onClick={closeModal}
        >
          <Image
            src={images.close_btn}
            sizes='(max-width: 100vw) 100vw'
            fill
            quality={100}
            alt='close button'
          />
        </div>
        <div className={styles.errorModal__content}>
          <p>{errorMessage}</p>
          <div
            className={styles.errorModal__rechargeWrapper}
            onClick={handleRechargeClick}
          >
            <Image
              src={images.first_purchase_btn}
              alt='recharge-button'
              sizes='(max-width: 100vw) 100vw'
              fill
              quality={100}
            />
            <span>{t.recharge}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ErrorModal;
