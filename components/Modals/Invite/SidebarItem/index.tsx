import React, { FC } from 'react';
import { TWebviewList } from '@/services/response-type';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import styles from '../index.module.scss';

type Props = {
  sidebar:
    | TWebviewList
    | {
        name: string;
        id: number;
      };
  isActive: boolean;
  onClick: () => void;
};

const SidebarItem: FC<Props> = ({ sidebar, isActive, onClick }) => {
  return (
    <div
      key={sidebar.id}
      onClick={onClick}
    >
      <motion.div
        className={isActive ? styles.activeSidebar : styles.sidebarItem}
        whileTap={{ scale: isActive ? 1 : 0.9 }}
      >
        <div className={classNames(styles.btnBg, { [styles.btnBg__inActive]: !isActive })} />
        <span>{sidebar.name}</span>
      </motion.div>
    </div>
  );
};

export default SidebarItem;
