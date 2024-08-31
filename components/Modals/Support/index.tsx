import CloseSupportModalButton from './components/close-button.support';
import CustomerServiceContent from './components/content.support';
import LiveChatButton from './components/liveChat-button.support';
import CustomerServiceTitle from './components/title.support';
import styles from './index.module.scss';

const SupportComponent = () => {
  return (
    <div className={styles.supportBackdrop}>
      <div className={styles.supportBoard}>
        <CloseSupportModalButton />
        <CustomerServiceTitle />
        <CustomerServiceContent />
        <LiveChatButton />
      </div>
    </div>
  );
};

export default SupportComponent;
