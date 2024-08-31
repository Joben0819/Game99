import Image from 'next/image';
import { FC } from 'react';
import classNames from 'classnames';
import { DAILY_BONUS_STATUS } from '@/constants/enums';
import { images } from '@/utils/resources';
import { RewardProps } from '../reward';
import styles from './styles.module.scss';

type IconProps = Pick<RewardProps['status'], 'code' | 'icon'> & Pick<RewardProps, 'rewardIcon'>;

const Icon: FC<IconProps> = ({ code, icon, rewardIcon }) => {
  const isClaimable = code === DAILY_BONUS_STATUS.CLAIMABLE;
  const isClaimedOrNotClaimed = code === DAILY_BONUS_STATUS.CLAIMED || code === DAILY_BONUS_STATUS.NOT_CLAIMED;

  return (
    <div
      className={classNames(styles.rewardIcon, {
        [styles['rewardIcon--claimable']]: isClaimable,
      })}
    >
      <Image src={rewardIcon || images.db_ph_coin} alt="reward-icon" fill sizes="20vw" />

      {isClaimedOrNotClaimed && (
        <div className={styles.collectedIcon}>
          <Image src={icon || images.not_collected_icon} alt="reward-icon" fill sizes="20vw" />
        </div>
      )}
    </div>
  );
};

export default Icon;
