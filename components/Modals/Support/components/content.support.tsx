import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

const CustomerServiceContent = () => {
  const t = useTranslations().support;

  return (
    <div className={styles.supportContent}>
      <p>{t.content}</p>
    </div>
  );
};

export default CustomerServiceContent;
