import { usePathname } from 'next/navigation';
import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type RightPanelProps = {
  children: ReactNode;
  isWithdrawPage?: boolean;
};

const RightPanel: FC<RightPanelProps> = ({ children, isWithdrawPage }) => {
  const path = usePathname();

  return (
    <div
      className={classNames([styles.rightPanel], {
        [styles.withdrawPage]: isWithdrawPage,
        // [styles.rightPanelHistory]: path === `/recharge-record`,
      })}
    >
      <div
        className={styles.rightPanelContent}
        data-route={path}
      >
        {children}
      </div>
    </div>
  );
};

export default RightPanel;
