import { FC } from 'react';
import { ActivityTypesData } from '@/services/response-type';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import styles from './styles.module.scss';

type MenuItemProps = {
  id?: string;
  index: number;
  activeBtn: number;
  menu: ActivityTypesData;
  onClick: (menu: ActivityTypesData, index: number) => void;
};

const MenuItem: FC<MenuItemProps> = ({ index, activeBtn, menu, onClick, id }) => {
  const readMsgID = useAppSelector((state) => state.appData.readMsgID);
  const isActive = activeBtn === index;

  const btnClassnames = classNames('relative', styles.btnContainer, { [styles.active]: isActive });
  const redDotClassnames = classNames(styles.redDot, {
    [styles['redDot--visible']]: !readMsgID?.includes(String(menu?.id)),
  });

  return (
    <div
      id={id}
      className={btnClassnames}
      onClick={() => !isActive && onClick(menu, index)}
    >
      <div
        data-active={isActive}
        className={styles.btn}
      >
        <span>{menu.name}</span>
      </div>
      <div className={redDotClassnames} />
    </div>
  );
};

export { MenuItem };
