'use client';

import { FC } from 'react';
import { DATA_LANG } from '@/constants/enums';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import { RewardProps } from '../reward';
import styles from './styles.module.scss';

type DayProps = RewardProps['status'] & Pick<RewardProps, 'day'>;

const Day: FC<DayProps> = ({ code, day }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().dailyBonus;

  const dayText =
    locale === DATA_LANG.EN || locale === DATA_LANG.IND ? `${t.day} ${day}` : `${t.number} ${day} ${t.day}`;

  return (
    <span
      data-claimable={code}
      className={styles.day}
    >
      {dayText}
    </span>
  );
};

export default Day;
