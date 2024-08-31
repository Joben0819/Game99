import { useState } from 'react';
import { MODAL_BG_ANIMATION } from '@/constants/app';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import { moneyFormat } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import SVGA from '../SVGA';
import styles from './index.module.scss';

const PrizeModal = ({ points }: { points?: string }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().affiliate;
  const [isSVGALoaded, setIsSVGALoaded] = useState(false);

  const handleSVGALoaded = () => {
    setIsSVGALoaded(true);
  };

  const renderModalContent = () => {
    return (
      <div className={styles.modalContent}>
        <h1 data-lang={locale}>{t.modalContent.congrats}</h1>
        <h2>{moneyFormat(+points! || 0, false)}</h2>
      </div>
    );
  };

  return (
    <motion.div
      variants={MODAL_BG_ANIMATION}
      initial='hidden'
      animate='visible'
      exit='exit'
      className={styles.prizeModalWrapper}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isSVGALoaded ? 1 : 0 }}
        exit={{ scale: 0 }}
        className={styles.modalContainer}
      >
        <SVGA
          showSVGA={isSVGALoaded}
          svga={images.coins_treasure}
          isSVGALoaded={handleSVGALoaded}
        />
        {renderModalContent()}
      </motion.div>
    </motion.div>
  );
};

export default PrizeModal;
