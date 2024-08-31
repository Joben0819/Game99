import { FC, memo } from 'react';
import CurrentLvl from './components/current-level';
import VipLevels from './components/vip-levels';
import styles from './index.module.scss';

type SideMenuProps = { onChangeVip: (vip: number) => void };

const SideMenu: FC<SideMenuProps> = ({ onChangeVip }) => {
  return (
    <div className={styles.smWrapper}>
      <CurrentLvl />
      <VipLevels onChangeVip={onChangeVip} />
    </div>
  );
};

export default memo(SideMenu);
