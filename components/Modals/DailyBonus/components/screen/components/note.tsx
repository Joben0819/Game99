'use client';

import { memo } from 'react';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './styles.module.scss';

const Note = () => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().dailyBonus;

  return (
    <div
      data-lang={locale}
      className={styles.noteWrapper}
    >
      {t.bottomTip}
    </div>
  );
};

export default memo(Note);
