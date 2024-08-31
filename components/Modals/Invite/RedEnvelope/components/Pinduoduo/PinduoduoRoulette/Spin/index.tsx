import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import roulette from '@/public/assets/commons/envelope/roulette.png';
import styles from './index.module.scss';

type TProps = {
  isLoading: boolean;
};

const Spin: FC<TProps> = ({ isLoading }) => {
  const controls = useAnimation();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (isLoading) {
      controls.start({
        rotate: [0, 360],
        transition: {
          repeat: Infinity,
          ease: 'linear',
          duration: 1,
        },
      });
    } else {
      controls.start({
        rotate: 360,
        transition: {
          ease: 'easeOut',
          duration: 1,
        },
      });
    }
  }, [isLoading]);

  return (
    <motion.div
      animate={controls}
      className={styles.roulette}
    >
      <Image
        src={roulette}
        alt='roulette'
      />
    </motion.div>
  );
};

export default Spin;
