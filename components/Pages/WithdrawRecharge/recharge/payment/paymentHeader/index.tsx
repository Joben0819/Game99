import { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { isChineseCharacters } from '@/utils/helpers';

import styles from './index.module.scss';

type PaymentProps = {
  bankName: string;
  children?: ReactNode;
};

const PaymentHeader: FC<PaymentProps> = ({ bankName, children }) => {
  return (
    <div className={classNames(styles.headerContainer, { [styles.isChinese]: isChineseCharacters(bankName) })}>
      <p data-textafter={bankName}>{bankName}</p>
      <div>{children}</div>
    </div>
  );
};

export default PaymentHeader;
