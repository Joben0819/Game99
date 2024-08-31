import { useEffect } from 'react';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setPageLoad } from '@/reducers/appData';
import CloseButton from '@/components/Customs/CloseButton';
import { useAppDispatch } from '@/store';
import styles from '../index.module.scss';

const CloseAvatarModalButton = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(setPageLoad(false));
    };
  }, []);

  const closeAvatarModal = () => {
    dispatch(setActiveModal(DATA_MODAL.CLOSE));
    dispatch(setPageLoad(true));
  };

  return (
    <div
      className={styles.changeAvatarCloseBtn}
      onClick={closeAvatarModal}
    >
      <CloseButton className="w-full aspect-square object-contain" />
    </div>
  );
};

export default CloseAvatarModalButton;
