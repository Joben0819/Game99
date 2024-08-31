import { FC } from 'react';
import { setActiveTab, setDateFilter } from '@/reducers/userData';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import styles from './index.module.scss';

type SidebarProps = {
  tabs: { id: number; name: string }[];
};

const Sidebar: FC<SidebarProps> = ({ tabs }) => {
  const dispatch = useAppDispatch();
  const {
    personalCenter: { activeTab },
  } = useAppSelector((state) => state.userData);

  return (
    <div className={styles.sidebarWrapper}>
      {tabs?.map((tab) => {
        return (
          <div
            key={tab.id}
            onClick={() => {
              dispatch(setActiveTab(tab.id));
              dispatch(setDateFilter('today'));
            }}
          >
            <motion.div
              className={classNames(styles.tab, { [styles.activeTab]: tab.id === activeTab })}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                dispatch(setActiveTab(tab.id));
                dispatch(setDateFilter('today'));
              }}
            >
              <span>{tab.name}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
