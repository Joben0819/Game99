import { FC } from 'react';
import { moneyFormat } from '@/utils/helpers';
import { RewardProps } from '../reward';
import styles from './styles.module.scss';

type AmountProps = Pick<RewardProps['status'], 'code'> & Pick<RewardProps, 'rewardAmount'>;

const Amount: FC<AmountProps> = ({ code, rewardAmount }) => {
  const amount = moneyFormat(+rewardAmount?.max! ?? 0);

  return (
    <span data-claimable={code} className={styles.rewardValue}>
      {amount}
    </span>
  );
};

export default Amount;
