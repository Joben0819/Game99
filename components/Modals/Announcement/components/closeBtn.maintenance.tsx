import Image from 'next/image';

import { setActiveModal } from '@/reducers/appData';
import { useAppDispatch } from '@/store';
import { images } from '@/utils/resources';
import { DATA_MODAL } from '@/constants/enums';

import styles from '../index.module.scss';

const CloseMaintenanceModalButton = () => {
  const dispatch = useAppDispatch();

  const handleCloseModal = () => dispatch(setActiveModal(DATA_MODAL.CLOSE));

  return (
    <div className={styles.closeMaintenanceModalBtn} onClick={handleCloseModal}>
      <Image
        src={images.close_btn_maintenance}
        alt="Close maintenance modal button"
        width={99}
        height={75}
        quality={100}
      />
    </div>
  );
};

export default CloseMaintenanceModalButton;
