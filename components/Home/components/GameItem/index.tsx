import { FC, useLayoutEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { setPageLoad } from '@/reducers/appData';
import { TGameItem } from '@/services/response-type';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { ImgWithFallback } from '@/components/Customs/ImgWithFallback';
import { isLoggedIn } from '@/utils/helpers';
import { images, staticImport } from '@/utils/resources';
import useOpenGame from '@/hooks/useOpenGame';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type GameItemProps = {
  idx: number;
  gameListId: number;
  gameItem: TGameItem;
  setTopRowWidth?: () => void;
  isEnteringGame: (loading: boolean) => void;
};

const GameItem: FC<GameItemProps> = ({ idx, gameListId, gameItem, setTopRowWidth, isEnteringGame }) => {
  const { openGame } = useOpenGame();
  const dispatch = useDispatch();
  const t = useTranslations().game;

  useLayoutEffect(() => {
    setTopRowWidth && setTopRowWidth();
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const enterGame = (id_icon: string, isMaintenance: boolean) => {
    if (isMaintenance) {
      toast.error(t.gameMaintenance, { id: 'error' });
      return;
    }
    isEnteringGame(true);
    localStorage.setItem('curr-tab', String(gameListId));
    openGame(id_icon || '', () => isEnteringGame(false));
  };

  return (
    <AnimatePresence key={gameItem?.icon + idx}>
      <motion.div
        key={gameItem?.icon + idx}
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
        className={classNames(`gameItem ${styles.gameItem}`, { [styles.isMaintenance]: gameItem?.maintain })}
      >
        {gameItem?.maintain && (
          <div
            className={styles.mtImg}
            onClick={() => enterGame(gameItem?.id.toString(), gameItem?.maintain ?? false)}
          >
            <ImgWithFallback
              sizes='25vw'
              alt='Game'
              src={images.mt}
              fill
              quality={100}
            />
          </div>
        )}
        <div
          className={styles.gameImg}
          onClick={() => {
            if (isLoggedIn()) {
              !gameItem.maintain && enterGame(gameItem?.id.toString(), gameItem.maintain ?? false);
            } else {
              dispatch(setActiveModal(DATA_MODAL.LOGIN_MODAL));
            }
          }}
        >
          <ImgWithFallback
            sizes='25vw'
            alt='Game'
            src={gameItem?.icon ?? staticImport.game_item_placeholder}
            fill
            quality={100}
            loadingPlaceholder={staticImport.game_item_placeholder}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameItem;
