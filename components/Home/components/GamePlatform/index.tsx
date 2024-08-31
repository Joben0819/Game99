import { FC, useLayoutEffect } from 'react';
import { TGamePlatform } from '@/services/response-type';
import { AnimatePresence, motion } from 'framer-motion';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { staticImport } from '@/utils/resources';
import styles from './index.module.scss';

type GamePlatformProps = {
  idx: number;
  gameListId: number;
  gamePlatform: TGamePlatform;
  setTopRowWidth?: () => void;
  handlePlatformClick: (pid: number) => void;
};

const GamePlatform: FC<GamePlatformProps> = ({ gamePlatform, idx, handlePlatformClick, setTopRowWidth }) => {
  
  useLayoutEffect(() => {
    setTopRowWidth && setTopRowWidth();
  }, []);

  return (
    <AnimatePresence key={gamePlatform?.icon + idx}>
      <motion.div
        key={gamePlatform?.cardIcon + idx}
        initial={{ x: '100vw' }}
        animate={{
          x: 0,
          transition: {
            x: {
              type: 'spring',
              duration: 0.8,
              bounce: 0.2,
              delay: 0.04 + idx * 0.02,
            },
          },
        }}
        whileTap={{ scale: 0.9 }}
        className={`gamePlatform ${styles.gamePlatform}`}
        id={`platform_${gamePlatform.id}`}
      >
        <div
          className={styles.gameImg}
          onClick={() => {
            handlePlatformClick(gamePlatform?.id);
          }}
        >
          <ImgWithFallback
            sizes='25vw'
            alt='Game Platform'
            src={gamePlatform?.cardIcon || staticImport.game_platform_placeholder}
            fill
            quality={100}
            loading='lazy'
            loadingPlaceholder={staticImport.game_platform_placeholder}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GamePlatform;
