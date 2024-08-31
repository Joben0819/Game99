import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

const MaintenanceTitle = () => {
  const t = useTranslations().maintenance;

  return (
    <HeaderTitle
      text={t.title}
      className={styles.maintenanceTitle}
      size={32}
    />
  );
};

export default MaintenanceTitle;
