import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useTranslations } from '@/hooks/useTranslations';
import styles from '../index.module.scss';

const ChangeAvatarTitle = () => {
  const t = useTranslations().changeAvatar;

  return (
    <HeaderTitle
      text={t.title}
      className={styles.changeAvatarTitle}
      size={32}
    />
  );
};

export default ChangeAvatarTitle;
