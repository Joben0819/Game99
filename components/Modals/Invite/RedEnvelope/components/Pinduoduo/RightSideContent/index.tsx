import React, { FC } from 'react';
import { GameInviterData } from '@/constants/types';
import DeadlineTimer from './DeadlineTimer';
import Envelope from './Envelope';
import WinnerList from './WinnerList';
import styles from './index.module.scss';

type TProps = {
  gameInviterData: GameInviterData | null;
  handleGetInviterData: () => void;
  showSVGA: boolean;
};

const RightSideContent: FC<TProps> = ({ gameInviterData, handleGetInviterData, showSVGA }) => {
  return (
    <div className={styles.container}>
      <Envelope
        gameInviterData={gameInviterData}
        showSVGA={showSVGA}
      />
      <DeadlineTimer
        expireTime={gameInviterData?.expireTime}
        handleGetInviterData={handleGetInviterData}
      />
      <WinnerList />
    </div>
  );
};

export default RightSideContent;
