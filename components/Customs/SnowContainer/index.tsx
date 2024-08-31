import Image from 'next/image';
import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { images } from '@/utils/resources';
import CloseButton from '../CloseButton';
import HeaderTitle from '../HeaderTitle';
import styles from './index.module.scss';

type SnowContainerProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

const SnowContainer: FC<SnowContainerProps> = ({ title, children, onClose }) => {
  return (
    <motion.div
      className={styles.snowModal}
      key={'container'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.snowWrapper}>
        <HeaderTitle text={title} className={styles.title} size={40} />
        <div className={styles.snowContainer}>
          <Image src={images.snow_1} alt="snow1" width={300} height={40} />
          <Image src={images.snow_2} alt="snow2" width={300} height={40} />
          <Image src={images.snow_3} alt="snow3" width={300} height={40} />
        </div>
        {children}
        <CloseButton onClick={onClose} className={styles.closeBtn} />
      </div>
    </motion.div>
  );
};

export default SnowContainer;
