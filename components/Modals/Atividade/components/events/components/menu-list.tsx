import { FC, useEffect, useRef, useState } from 'react';
import { setReadMsgID } from '@/reducers/appData';
import { ActivityTypesData } from '@/services/response-type';
import { useAppDispatch, useAppSelector } from '@/store';
import { isElementFullyVisible } from '@/utils/helpers';
import { MenuItem } from './menu-item';
import { SideMenuTypes } from './side-menu';
import styles from './styles.module.scss';

const SideMenuList: FC<SideMenuTypes> = ({ types, activeIndex, handleActiveSideMenu }) => {
  const [activeBtn, setActiveBtn] = useState<number>(activeIndex);
  const { readMsgID } = useAppSelector((state) => state.appData);
  const dispatch = useAppDispatch();
  const sideBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeMenu = document.getElementById(`active`);
    const sideBar = sideBarRef.current;
    if (activeMenu && sideBar && !isElementFullyVisible(activeMenu, sideBar)) {
      setTimeout(() => {
        sideBar?.scrollTo({
          top: activeMenu.offsetTop - activeMenu.scrollHeight,
          behavior: 'smooth',
        });
      }, 500);
    }
  }, [types, activeBtn]);

  useEffect(() => {
    setActiveBtn(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const newId = types[activeIndex]?.id?.toString();
    newId && !readMsgID.includes(newId) && dispatch(setReadMsgID([...readMsgID, newId]));
  }, [types]);

  const handleClick = (menu: ActivityTypesData, index: number) => {
    setActiveBtn(index);
    handleActiveSideMenu(menu);
    localStorage.setItem('banner-clicked', menu.id.toString());

    if (!readMsgID?.includes(String(menu?.id))) {
      dispatch(setReadMsgID([...(readMsgID ?? []), String(menu?.id)]));
    }
  };

  return (
    <div
      className={styles.btnWrapper}
      ref={sideBarRef}
    >
      {types?.map((menu, index) => (
        <MenuItem
          key={menu.id}
          menu={menu}
          index={index}
          activeBtn={activeBtn}
          onClick={handleClick}
          id={activeBtn === index ? 'active' : 'inactive'}
        />
      ))}
    </div>
  );
};

export { SideMenuList };
