import React, { Dispatch, FC, SetStateAction } from 'react';
import classNames from 'classnames';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';

type TProps = {
  activeHeader: 'pinduoduo' | 'lottery' | 'rewards' | 'inviter';
  setActiveHeader: Dispatch<SetStateAction<'pinduoduo' | 'lottery' | 'rewards' | 'inviter'>>;
};

const Header: FC<TProps> = ({ activeHeader, setActiveHeader }) => {
  const t = useTranslations().affiliate;

  const HEADER_LIST = [
    {
      title: t.luckySpin,
      value: 'pinduoduo',
    },
    {
      title: t.lotteryLogs,
      value: 'lottery',
    },
    {
      title: t.rewardLogs,
      value: 'rewards',
    },
    {
      title: t.inviterGameRules,
      value: 'inviter',
    },
  ] as const;

  return (
    <ul className={styles.container}>
      {HEADER_LIST.map((item) => (
        <li
          key={item.title}
          className={classNames(styles.headerItem, {
            [styles.active]: activeHeader === item.value,
          })}
          onClick={() => setActiveHeader(item.value)}
        >
          <p>{item.title}</p>
        </li>
      ))}
    </ul>
  );
};

export default Header;
