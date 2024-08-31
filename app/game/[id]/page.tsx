'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { DATA_MODAL, JUMP_TYPE } from '@/constants/enums';
import { setActiveModal } from '@/reducers/appData';
import { getConfigRechargeBonus } from '@/services/api';
import { useAppDispatch } from '@/store';
import { isValidURL } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useGameScreen } from '@/hooks/useGameScreen';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import GameExit from './GameExit';
import style from './index.module.scss';

type GamePageProps = {
  params: { id: string };
};

const GamePage: FC<GamePageProps> = ({ params }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const draggableRef = useRef<any>(null);
  const { resetInternetStatus } = useWithDispatch();
  const { game, showExit, defaultPosition, handleCancelExit, onDrag, onDragStart, onDragStop } = useGameScreen();

  const checkIfHasRechargeBonus = async () => {
    try {
      let response;
      if (localStorage.getItem('rechargeBonusData')) {
        response = JSON.parse(localStorage.getItem('rechargeBonusData') || '{}');
        showRechargeBonusModal();
      } else {
        response = await getConfigRechargeBonus();
        if (!response.data.data) {
          router.push('/recharge');
        } else showRechargeBonusModal();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showRechargeBonusModal = () => {
    router.push('/');
    setTimeout(() => dispatch(setActiveModal(DATA_MODAL.RECHARGE_BONUS)), 1000);
  };

  useEffect(() => {
    resetInternetStatus();
    const resetDraggable = () => {
      setTimeout(() => {
        localStorage.removeItem('exitButtonCoordsMobile');
        localStorage.removeItem('exitButtonCoordsDesktop');
        draggableRef.current?.setState({ x: 30, y: 38 });
      }, 100);
    };

    const handleGameMessages = (e: any) => {
      try {
        const data = JSON.parse(e.data);
        if (data.jumpType === JUMP_TYPE.RECHARGE) {
          checkIfHasRechargeBonus();
        }
      } catch (error) {}
    };

    window.addEventListener('orientationchange', resetDraggable);
    window.addEventListener('message', handleGameMessages);
    return () => {
      window.removeEventListener('orientationchange', resetDraggable);
      window.removeEventListener('message', handleGameMessages);
    };
  }, []);

  return (
    <div
      className={style.gameContainer}
      id='game-container'
    >
      <Draggable
        defaultPosition={defaultPosition}
        bounds='body'
        onStop={onDragStop}
        onStart={onDragStart}
        onDrag={onDrag}
        ref={draggableRef}
      >
        <div
          className={style.exit}
          id='exit-button'
        >
          <Image
            src={images.game_back}
            alt=''
            fill
            sizes='100%'
          />
        </div>
      </Draggable>

      <iframe
        sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
        width='100%'
        height='100%'
        className='touch-none'
        src={isValidURL(game) ? game : undefined}
        srcDoc={!isValidURL(game) ? game : undefined}
      />

      {!!showExit && (
        <GameExit
          onCancel={handleCancelExit}
          gameId={String(params.id)}
        />
      )}
    </div>
  );
};

export default GamePage;
