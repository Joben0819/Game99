import { useRouter } from 'next/navigation';
import { DATA_MODAL } from '@/constants/enums';
import { setActiveModal, setSecondModal } from '@/reducers/appData';
import { motion } from 'framer-motion';
import CloseButton from '@/components/Customs/CloseButton';
import { useAppDispatch, useAppSelector } from '@/store';
import styles from '../index.module.scss';

const CloseSupportModalButton = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { activeModal } = useAppSelector((state) => state.appData);
  const supportModal = localStorage.getItem('support-modal') ?? '';

  const closeModal = () => {
    if (activeModal === DATA_MODAL.SUPPORT) {
      if (supportModal) {
        localStorage.removeItem('support-modal');
        push('/withdraw');
      } else if (localStorage.getItem('recent-modal') === 'VIP') {
        dispatch(setActiveModal(DATA_MODAL.VIP));
      } else dispatch(setActiveModal(DATA_MODAL.CLOSE));
    } else dispatch(setSecondModal(DATA_MODAL.CLOSE));
  };

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={styles.closeSupportButton}
      onClick={closeModal}
    >
      <CloseButton />
    </motion.div>
  );
};

export default CloseSupportModalButton;
