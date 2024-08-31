'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { LOCAL_FILTERS } from '@/constants/enums';
import { TTradeTypes } from '@/services/response-type';
import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import useClickOutSide from '@/hooks/useClickOutSide';
import styles from './index.module.scss';

type TradeTypesDropdownProps = {
  label: string;
  activeTab: number;
  classProp?: String;
  items: TTradeTypes[] | undefined;
  defaultSelectedItem?: TTradeTypes;
  handleSelectFilter: (filter: TTradeTypes['name']) => void;
};

const TradeTypesDropdown: FC<TradeTypesDropdownProps> = ({
  label,
  activeTab,
  classProp,
  items,
  defaultSelectedItem,
  handleSelectFilter,
}) => {
  const [selectedItem, setSelectedItem] = useState(items ? items[0] : { des: '', name: '', type: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const clickOutSide = useClickOutSide(dropDownRef);

  useEffect(() => {
    const selected = localStorage.getItem(`profile-status-filter`);

    if (selected) {
      const parsedJson = JSON.parse(selected) as TTradeTypes;
      setSelectedItem(parsedJson);
      handleSelectFilter(parsedJson.name ?? null);
    } else {
      if (defaultSelectedItem) setSelectedItem(defaultSelectedItem);
      else {
        setSelectedItem(items?.length ? items[0] : { des: '', name: '', type: 0 });
      }
    }
  }, []);

  useEffect(() => {
    if (!!items?.length) {
      setSelectedItem(items[0]);
    }
  }, [items]);

  useEffect(() => {
    if (clickOutSide) {
      setShowDropdown(false);
    }
  }, [clickOutSide]);

  const renderDropdownHead = () => (
    <div
      ref={dropDownRef}
      className={styles.dropdownHead}
      onClick={() => setShowDropdown((prev) => !prev)}
    >
      <span>{selectedItem?.des}</span>
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
          style={{ willChange: 'transform, opacity, height' }}
        >
          <div className={styles.list}>
            {items?.map((item, idx) => {
              return (
                <span
                  key={idx}
                  className={selectedItem?.name === item.name ? styles.isSelected : ''}
                  onClick={() => {
                    handleSelectFilter(item.name ?? null);
                    setSelectedItem(item);

                    localStorage.setItem(LOCAL_FILTERS.FUND_DETAILS_STATUS, JSON.stringify(item));
                  }}
                >
                  {item.des}
                </span>
              );
            })}
          </div>
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

export default TradeTypesDropdown;
