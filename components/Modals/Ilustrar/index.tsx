import CloseButton from '@/components/Customs/CloseButton';
import HeaderTitle from '@/components/Customs/HeaderTitle';
import { useTranslations } from '@/hooks/useTranslations';
import Content from './components/content';
import SideMenu from './components/side-menu';
import styles from './index.module.scss';
import { useAnnouncement } from './useAnnouncement';

const Ilustrar = () => {
  const t = useTranslations().announcement;
  const { activeAnnouncement, filteredAnnouncements, handleActive, handleClose } = useAnnouncement();

  const sideMenuProps = {
    activeAnnouncement,
    filteredAnnouncements,
    handleActive,
  };

  const contentProps = {
    filteredAnnouncements,
    activeAnnouncement,
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <HeaderTitle
          text={t.announcement}
          className={styles.title}
          size={40}
        />
        <SideMenu {...sideMenuProps} />
        <Content {...contentProps} />
        <CloseButton
          onClick={handleClose}
          className={styles.closeBtn}
        />
      </div>
    </div>
  );
};

export default Ilustrar;
