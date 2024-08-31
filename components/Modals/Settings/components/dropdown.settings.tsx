import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';
import { LANGUAGES } from '@/constants/app';
import { DATA_LANG } from '@/constants/enums';
import { setLanguage } from '@/reducers/appData';
import { resetPaymentData } from '@/reducers/paymentData';
import { storeLang } from '@/services/api';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { isLoggedIn } from '@/utils/helpers';
import { useWithDispatch } from '@/hooks/useWithDispatch';
import styles from '../index.module.scss';

type DropdownProps = {
  isDropdownOpen: boolean;
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
};

const Dropdown: FC<DropdownProps> = ({ isDropdownOpen, setShowDropdown }) => (
  <AnimatePresence>
    {isDropdownOpen && (
      <RenderDropdown
        isDropdownOpen={isDropdownOpen}
        setShowDropdown={setShowDropdown}
      />
    )}
  </AnimatePresence>
);

const RenderDropdown: FC<Readonly<DropdownProps>> = ({ isDropdownOpen, setShowDropdown }) => {
  const dispatch = useAppDispatch();
  const { getNewLoginMethods } = useWithDispatch();
  const { getBtnClickAnnouncements } = useWithDispatch();
  const { id } = useAppSelector((s) => s.userData.userInfo);
  const locale = useAppSelector((s) => s.appData.language);

  const handleSelectLanguage = async (lang: DATA_LANG) => {
    if (lang === locale) return;
    storeLang(lang);
    localStorage.setItem('lang', lang);
    await getNewLoginMethods();
    dispatch(resetPaymentData());
    dispatch(setLanguage(lang));
    if (id && isLoggedIn()) {
      try {
        getBtnClickAnnouncements();
      } catch (error) {
        console.error(error);
      }
    }
    setShowDropdown(!isDropdownOpen);
  };

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
      transition={{ duration: 0.2 }}
      className={styles.dropdownCon}
    >
      <div className={styles.dropdown}>
        {LANGUAGES.map((lang) => {
          return (
            <div
              key={lang.locale}
              className={classNames(styles.dropdownSelections, {
                [styles['dropdownSelections--selected']]: lang.locale === locale,
              })}
              onClick={() => {
                handleSelectLanguage(lang.locale);
              }}
            >
              <div className={styles.languageSelectionDefaultFlag}>
                <Image
                  src={lang.flag}
                  alt={lang.text}
                  width={1235}
                  height={650}
                />
              </div>
              <span>{lang.text}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Dropdown;
