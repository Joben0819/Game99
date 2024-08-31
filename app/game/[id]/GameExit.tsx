import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { setPrevPage } from '@/reducers/appData';
import { useAppDispatch } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type GameExitProps = {
  gameId: string;
  onCancel: () => void;
};

const GameExit: FC<GameExitProps> = ({ gameId, onCancel }) => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations().game;

  const handleExit = () => {
    dispatch(setPrevPage('game'));
    localStorage.setItem('game-id', gameId ?? '');
    push('/');
  };

  return (
    <div className={styles.modal}>
      <div className={styles.cardExit}>
        <div className={styles.header}>{t.confirmation}</div>
        <div className={styles.part}>
          <div
            onClick={onCancel}
            className={styles.left}
          >
            <div className={styles.text}>{t.cancel}</div>
          </div>
          <div className='w-[1px] bg-gray-400 my-[.15rem]' />
          <div
            onClick={handleExit}
            className={styles.right}
          >
            {t.confirm}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameExit;
