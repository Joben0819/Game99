import { memo } from 'react';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

const CustomerServiceTitle = () => {
  const t = useTranslations().support;

  return (
    <HeaderTitle
      text={t.modalTitle}
      className={styles.supportTitle}
      size={32}
    />
  );
};

export default memo(CustomerServiceTitle);
