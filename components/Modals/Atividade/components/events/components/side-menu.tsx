import Image from 'next/image';
import { FC } from 'react';
import { ActivityTypesData } from '@/services/response-type';
import { images } from '@/utils/resources';
import { SideMenuList } from './menu-list';
import styles from './styles.module.scss';

export type SideMenuTypes = {
  types: ActivityTypesData[];
  activeIndex: number;
  handleActiveSideMenu: (menu: ActivityTypesData) => void;
};

const SideMenu: FC<SideMenuTypes> = ({ types, activeIndex, handleActiveSideMenu }) => {
  return (
    <div className={styles.sideBarWrapper}>
      <div className={styles.leftPanel}>
        <Image src={images.act_left_panel} alt="" fill sizes="100%" priority />
        <SideMenuList types={types} activeIndex={activeIndex} handleActiveSideMenu={handleActiveSideMenu} />
      </div>
    </div>
  );
};

export default SideMenu;
