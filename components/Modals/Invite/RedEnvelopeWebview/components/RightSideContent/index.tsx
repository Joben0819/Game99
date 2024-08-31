import { Dispatch, FC, SetStateAction } from 'react';
import { CardListType, GameInviterData } from '@/constants/types';
import Envelopes from '../Envelopes';
import LotteryCount from '../LotteryCount';
import styles from './index.module.scss';

type RightSideContentProps = {
  selected: number;
  gameInviterData: GameInviterData | null;
  cardList: Array<CardListType> | undefined;
  setMethodTab: Dispatch<SetStateAction<number>>;
  isSpinning: boolean;
  handleScroll: (params: string) => void;
  webView: boolean | undefined;
};

const RightSideContent: FC<RightSideContentProps> = ({
  selected,
  gameInviterData,
  cardList,
  setMethodTab,
  isSpinning,
  handleScroll,
  webView,
}) => {
  return (
    <div className={styles.rightSide}>
      <Envelopes
        selected={selected}
        gameInviterData={gameInviterData}
        cardList={cardList}
        webView={webView}
      />

      <LotteryCount
        gameInviterData={gameInviterData}
        setMethodTab={setMethodTab}
        isSpinning={isSpinning}
        handleScroll={handleScroll}
        webView={webView}
      />
    </div>
  );
};

export default RightSideContent;
