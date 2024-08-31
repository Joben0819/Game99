'use client';

// import { usePathname } from 'next/navigation';
import { FC, ReactNode } from 'react';
import classNames from 'classnames';
import styles from '@/components/Pages/WithdrawRecharge/index.module.scss';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  // const path = usePathname();

  return (
    <div className={styles.layoutWrapper}>
      <div
        className={classNames({
          [styles.panels]: true,
          // [styles.isRechargeRecord]: path === `/recharge-record`,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
