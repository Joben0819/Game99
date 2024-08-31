import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { TBankList } from '@/services/response-type';
import { AnimatePresence, motion } from 'framer-motion';
import { toRem } from '@/utils/helpers';
import { images } from '@/utils/resources';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './index.module.scss';
import classNames from 'classnames';

type DropDownProps = {
  data: TBankList[];
  onSelect: (item: TBankList) => void;
};

const DropDown: FC<DropDownProps> = ({ data, onSelect }) => {
  const t = useTranslations().withdraw;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<TBankList>({ id: 0, bankName: '', bankIcon: '', type: '' });

  useEffect(() => {
    if (data?.length) {
      setSelected({ id: 0, bankName: t.bankNamePH, bankIcon: '', type: '' });
    }
  }, [data]);

  const toggleDropDown = () => {
    setIsActive((prev) => !prev);
  };

  const handleSelect = (item: TBankList) => {
    setSelected(item);
    onSelect(item);
    setIsActive(false);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.selected}
        onClick={toggleDropDown}
      >
        <div className={styles.titleIcon}>
          <div className={styles.icon}>
            <Image
              src={selected?.bankIcon || images.bank_default_icon}
              alt='selected-icon'
              fill
              sizes='100%'
            />
          </div>
          <span className={classNames({ [styles.placeholder]: selected.bankIcon === '' })}>
            {selected?.bankName}
          </span>
        </div>

        <div className={styles.arrowDown}>
          <Image
            className={classNames(styles.downImg, { [styles['downImg--active']]: isActive})}
            alt='Dropdown arrow'
            src={images.chevron_down}
            width={8}
            height={5}
            quality={100}
          />
        </div>
      </div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: toRem(172), opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{
              duration: 0.1,
            }}
            layout
            className={styles.dropDownList}
          >
            {data?.map((item, index) => (
              <div
                key={index}
                className={classNames(styles.selected, { [styles.selectedOne]: selected.id === item.id })}
                onClick={() => handleSelect(item)}
              >
                <div className={styles.titleIcon}>
                  <div className={styles.icon}>
                    <Image
                      src={item.bankIcon || images.bank_default_icon}
                      alt='selected-icon'
                      fill
                      sizes='100%'
                    />
                  </div>
                  <span>{item.bankName}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropDown;
