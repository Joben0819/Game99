import { FC } from 'react';
import classNames from 'classnames';
import { TMemberBonusRewardsConfig } from '@/services/types';
import { DAILY_BONUS_STATUS } from '@/constants/enums';
import Amount from './reward/amout';
import Background from './reward/background';
import Day from './reward/day';
import Icon from './reward/icon';
import styles from './styles.module.scss';

export type RewardProps = TMemberBonusRewardsConfig & {
  isLvlDisabled: boolean;
};

const Reward: FC<RewardProps> = ({ status: { code, icon }, day, rewardIcon, rewardAmount, isLvlDisabled }) => {
  const isClaimable = code === DAILY_BONUS_STATUS.CLAIMABLE;

  const wrapperClassNames = classNames(styles.rewardWrapper, {
    'cursor-pointer': isClaimable,
    'pointer-events-none': !isClaimable,
    grayscale: isLvlDisabled,
  });

  return (
    <div className={wrapperClassNames}>
      <div className={styles.container}>
        <Background code={code} />
        <Day code={code} day={day} icon={icon} />
        <Icon code={code} icon={icon} rewardIcon={rewardIcon} />
        <Amount code={code} rewardAmount={rewardAmount} />
      </div>
    </div>
  );
};

export default Reward;
