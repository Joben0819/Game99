import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { LANGUAGES } from '@/constants/app';
import { TLanguage } from '@/services/types';
import { useAppSelector } from '@/store';
import { images } from '@/utils/resources';
import useClickOutSide from '@/hooks/useClickOutSide';
import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';
import Dropdown from './dropdown.settings';

const LanguageControls = () => {
  const t = useTranslations().settings;
  const [languageProps, setLanguageProps] = useState(LANGUAGES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const clickOutSide = useClickOutSide(dropDownRef);
  const locale = useAppSelector((state) => state.appData.language);

  useEffect(() => {
    localStorage.setItem('lang', locale);
    const language = LANGUAGES.find((lang) => lang.locale === locale);
    setLanguageProps(language as TLanguage);
  }, [locale]);

  useEffect(() => {
    const prevLocale = localStorage.getItem('lang');
    if (clickOutSide && locale === prevLocale) {
      setShowDropdown(false);
    }
  }, [clickOutSide]);

  return (
    <div className={styles.languageControls}>
      <h2>{t.language}</h2>
      <div className={styles.languageSelection}>
        <div
          className={styles.languageSelectionInput}
          onClick={() => setShowDropdown(!showDropdown)}
          ref={dropDownRef}
        >
          <div className={styles.languageSelectionDefaultContents}>
            <div className={styles.languageSelectionDefaultFlag}>
              <Image
                src={languageProps.flag}
                alt={languageProps.text}
                width={1235}
                height={650}
              />
            </div>
            <span>{t.lang}</span>
          </div>
          <div className={styles.languageSelectionChevron}>
            <Image
              src={images.chevron_icon}
              width={48}
              height={48}
              alt='down'
            />
          </div>
        </div>
        <Dropdown
          isDropdownOpen={showDropdown}
          setShowDropdown={setShowDropdown}
        />
      </div>
    </div>
  );
};

export default LanguageControls;
