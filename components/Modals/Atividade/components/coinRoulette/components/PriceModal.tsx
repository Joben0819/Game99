import { FC } from 'react';
import { MODAL_BG_ANIMATION } from '@/constants/app';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { isIPhone, moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import { WinningIcons } from '..';
import styles from './PriceModal.module.scss';

type PriceModalProps = {
  price: number;
  isWebView?: boolean;
  priceIcon?: WinningIcons;
  handleClose: () => void;
};

const PriceModal: FC<PriceModalProps> = ({ price, isWebView, priceIcon, handleClose }) => {
  const t = useTranslations().spin;

  return (
    <motion.div
      variants={MODAL_BG_ANIMATION}
      initial='hidden'
      animate='visible'
      exit='exit'
      className={classNames([styles.priceModal], { [styles.webview]: isWebView, [styles.iphone]: isIPhone() })}
      // onClick={() => handleClose()}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className={classNames(styles.priceModalWrapper, { [styles.webView]: isWebView, [styles.iphone]: isIPhone() })}
      >
        <p
          className={styles.title}
          data-textafter={t.congratulations}
        >
          {t.congratulations}
        </p>
        <p className={styles.details}>{t.youWon}</p>
        <div className={styles.priceContainer}>
          <motion.img
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8 }}
            src={images.rays}
            alt='rays'
            className={styles.rays}
          />
          <div className={styles.priceIcon}>
            <motion.img
              animate={{
                scale: [1, 1.2, 1.2, 1, 1],
                skew: [0, -5, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              src={images[`price_${priceIcon}`]}
              alt='priceIcon'
            />
          </div>
          <span>{moneyFormat(price)}</span>

          <div
            onClick={handleClose}
            className={styles.closeModal}
          ></div>
        </div>
        <motion.img
          animate={{ scale: 2, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 5 }}
          src={images.sparkles}
          alt='sparkles'
          className={styles.sparkles}
        />
      </motion.div>
    </motion.div>
  );
};

export default PriceModal;
