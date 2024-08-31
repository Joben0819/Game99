import { useRouter } from 'next/navigation';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { GameInviterData } from '@/constants/types';
import { setIsSpinning, setPageLoad } from '@/reducers/appData';
import { playInviterGame } from '@/services/api';
import { debounce } from 'lodash-es';
import { useAppSelector } from '@/store';
import PinduoduoRoulette from './PinduoduoRoulette';
import RightSideContent from './RightSideContent';
import styles from './index.module.scss';

type TProps = {
  setShowErrorModal: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  showWelcomeSVGA: boolean;
  gameInviterData: GameInviterData | null;
  setGameInviterData: Dispatch<SetStateAction<GameInviterData | null>>;
  setShowPrizeModal: Dispatch<SetStateAction<boolean>>;
  handleGetInviterData: () => void;
};

const Pinduoduo: FC<TProps> = ({
  setShowErrorModal,
  setErrorMessage,
  showWelcomeSVGA,
  gameInviterData,
  setShowPrizeModal,
  handleGetInviterData,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPriceTag, setShowPriceTag] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const { isSpinning } = useAppSelector((state) => state.appData);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayButton = debounce(async () => {
    if (isSpinning) return;

    try {
      if (gameInviterData?.playCount === 0) {
        router.push('invite/qr');
        dispatch(setIsSpinning(false));
        dispatch(setPageLoad(true));
        return;
      }

      dispatch(setIsSpinning(true));
      setIsLoading(true);

      const { data } = await playInviterGame();

      if (!!data.data?.errorMessage) {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);

        setTimeout(() => {
          setShowErrorModal(true);
          setErrorMessage(data.data?.errorMessage);
          dispatch(setIsSpinning(false));
        }, 3200);
        return;
      }

      if (data.code !== 200) {
        setTimeout(() => {
          toast.error(data?.msg);
          dispatch(setIsSpinning(false));
          setIsLoading(false);
        }, 2000);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 2300);

      setTimeout(() => {
        setEarnedPoints(data.data?.earnedPoints || 0);
        setShowPriceTag(true);
        if (data.data.hasWon) setShowPrizeModal(true);
      }, 3500);

      setTimeout(() => {
        dispatch(setIsSpinning(false));
        setShowPriceTag(false);
        handleGetInviterData();
      }, 7000);
    } catch (error: any) {
      dispatch(setIsSpinning(false));
      setIsLoading(false);
    }
  }, 200);

  return (
    <div className={styles.container}>
      <PinduoduoRoulette
        earnedPoints={earnedPoints}
        isLoading={isLoading}
        showWon={showPriceTag}
        handlePlayButton={handlePlayButton}
        gameInviterData={gameInviterData}
        isSpinning={isSpinning}
      />

      <RightSideContent
        gameInviterData={gameInviterData}
        handleGetInviterData={handleGetInviterData}
        showSVGA={showWelcomeSVGA}
      />
    </div>
  );
};

export default Pinduoduo;
