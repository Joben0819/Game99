import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

const MaintenanceContent = () => {
  const t = useTranslations().maintenance;

  return (
    <div className={styles.maintenanceContent}>
      <h2>{t.contentHeader}</h2>
      <p>{t.contentBody}</p>
    </div>
  );
};

export default MaintenanceContent;
