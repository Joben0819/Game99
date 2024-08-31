import { FC, memo } from 'react';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './styles.module.scss';

type HeaderProps = {
  isEvent: boolean;
};

const Header: FC<HeaderProps> = ({ isEvent }) => {
  const locale = useAppSelector((s) => s.appData.language);
  const t = useTranslations().activity;

  return (
    <h1
      data-lang={locale}
      className={classNames(styles.rightPanel__title, {
        [styles['rightPanel__title--isEvent']]: isEvent,
      })}
      data-shadow={t.header}
    >
      {t.header}
    </h1>
  );
};

export default memo(Header);
