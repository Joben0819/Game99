import CloseMaintenanceModalButton from './components/closeBtn.maintenance';
import MaintenanceContent from './components/content.maintenance';
import MaintenanceTitle from './components/title.maintenance';
import styles from './index.module.scss';

const Announcement = () => {
  return (
    <div className={styles.announcementWrapper}>
      <div className={styles.maintenanceModal}>
        <MaintenanceTitle />
        <MaintenanceContent />
        <CloseMaintenanceModalButton />
      </div>
    </div>
  );
};

export default Announcement;
