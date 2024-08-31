'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import useClickOutSide from '@/hooks/useClickOutSide';
import styles from './index.module.scss';

type Item = {
  label: string;
  filter: string;
  key: number;
};

type DateDropdownProps = {
  label: string;
  items: Item[];
  activeTab: number;
  classProp?: String;
  defaultSelectedItem?: Item;
  handleSelectFilter: (filter: string) => void;
};

const DateDropdown: FC<DateDropdownProps> = ({
  label,
  items,
  activeTab,
  classProp,
  defaultSelectedItem,
  handleSelectFilter,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item>(defaultSelectedItem || items[0]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const clickOutSide = useClickOutSide(dropDownRef);

  useEffect(() => {
    if (clickOutSide) {
      setShowDropdown(false);
    }
  }, [clickOutSide]);

  useEffect(() => {
    const selected = localStorage.getItem(`profile-date-filter-${activeTab}`);

    if (selected) {
      const parsedJson = JSON.parse(selected) as Item;
      setSelectedItem(parsedJson);
      handleSelectFilter(parsedJson.filter);
    } else {
      if (defaultSelectedItem) setSelectedItem(defaultSelectedItem);
      else {
        setSelectedItem(items[0]);
      }
    }
  }, [activeTab]);

  const renderDropdownHead = () => (
    <div
      ref={dropDownRef}
      className={styles.dropdownHead}
      onClick={() => setShowDropdown((prev) => !prev)}
    >
      <span>{selectedItem?.label}</span>

      <div
        className={classNames(styles.arrow, {
          [styles.arrowDown]: showDropdown,
        })}
      >
        <DownOutlined />
      </div>
    </div>
  );

  const renderDropdownList = () => (
    <AnimatePresence>
      {showDropdown && (
        <motion.div
          className={styles.dropdownContainer}
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {items.map((item) => {
            return (
              <span
                key={item.key}
                className={selectedItem?.key === item.key ? styles.isSelected : ''}
                onClick={() => {
                  handleSelectFilter(item.filter);
                  setSelectedItem(item);

                  localStorage.setItem(`profile-date-filter-${activeTab}`, JSON.stringify(item));
                }}
              >
                {item.label}
              </span>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderContent = () => (
    <>
      <span className={styles.label}>{label}</span>
      {renderDropdownHead()}
      {renderDropdownList()}
    </>
  );

  return <div className={classNames(styles.transactionDateDropdown, classProp)}>{renderContent()}</div>;
};

export default DateDropdown;
