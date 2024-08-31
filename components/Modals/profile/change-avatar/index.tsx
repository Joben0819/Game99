import { useDisableZoom } from '@/hooks/useDisabledZoom';
import CloseAvatarModalButton from './components/close-btn.avatar';
import ConfirmAvatarButton from './components/confirm.avatar';
import AvatarSelectionGrid from './components/selection-grid.avatar';
import ChangeAvatarTitle from './components/title.avatar';
import styles from './index.module.scss';

const ChangeAvatar = () => {
  useDisableZoom();

  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.changeAvatarContainer}>
        <CloseAvatarModalButton />
        <ChangeAvatarTitle />
        <AvatarSelectionGrid />
        <ConfirmAvatarButton />
      </div>
    </div>
  );
};

export default ChangeAvatar;
