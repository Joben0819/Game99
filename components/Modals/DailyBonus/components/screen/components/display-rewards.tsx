import { FC } from 'react';
import { TDailyBonusShowPopUp } from '@/services/types';
import RewardList from './reward-list';
import styles from './styles.module.scss';

export type DisplayRewardProps = {
  activeVip: number;
  setShowPopup: (data: TDailyBonusShowPopUp) => void;
};

const DisplayRewards: FC<DisplayRewardProps> = ({ activeVip, setShowPopup }) => {
  return (
    <div className={styles.rewardsWrapper}>
      <RewardList
        activeVip={activeVip}
        setShowPopup={setShowPopup}
      />
    </div>
  );
};

export default DisplayRewards;
