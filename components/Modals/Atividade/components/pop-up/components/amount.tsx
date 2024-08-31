import { FC } from 'react';
import styles from './styles.module.scss';

type AmountProps = {
  amount: number;
};

const Amount: FC<AmountProps> = ({ amount }) => {
  return <span className={styles.amount}>{amount ?? 0}</span>;
};

export default Amount;
